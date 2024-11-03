---
title: Accessing other repos from GitHub Actions
date: 2024-11-03
tags: ["article", "ci", "GitHub Actions"]
series: GitHub Actions thoughts
---

When working with GitHub Actions in an organization, you'll often need to access code from other repositories. Whether for GitOps deployments, shared Go modules, or something else entirely, it's a need that often crops up.

Unfortunately, GitHub doesn't offer any good solutions for this. [A discussion](https://github.com/orgs/community/discussions/46566) on allowing the short-lived `GITHUB_TOKEN` token to be granted access to other repos has existed for almost two years, and has just now gotten a response from someone on GitHub saying that they'll... add it to the backlog.

While we wait for a better GitHub-provided solution, here’s a look at the options available, along with the pros and cons of each. In this post, "source repository" refers to the repo where your action is running, and "target repository" is the one your workflow needs to access.

## Option 1 - User-bound PATs

The simplest approach is for the developer creating your CI workflow to generate a personal access token (PAT) with the required permissions, and then store it as a secret in your source repository.

Since GitHub supports fine-grained PATs scoped to specific repositories, a leak of this secret won't cause _too_ wide of a breach. This approach is also well-supported officially by GitHub, and doesn't require any third-party resources to be used.

The big downside of this is that the PAT is bound to whatever developer sets it up. Should this developer ever leave the organization, the setup will break until the PAT is replaced -- and you better hope it's well-documented where the PATs are used and what permissions they need.

Overall this is by far the easiest approach, but also the one that has the most pressing downsides. Binding CI workflows to a particular user is bound to cause trouble down the line.

| Pros                                             | Cons                                                           |
| ------------------------------------------------ | -------------------------------------------------------------- |
| [+] Simple and easy to understand                | [-] Ties the CI workflow to a specific GitHub user             |
| [+] Entirely GitHub-internal                     | [-] Requires manual rotation by various users in your org      |
| [+] Can be scoped to the specific workflow needs | [-] Easily leaked by bad actors with access to the source repo |

## Option 2 - Deploy keys

If your workflow only needs SSH-based read/write access to the target git repository, [deploy keys](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/managing-deploy-keys) can be a good option. These are SSH keys that are bound to a specific repository, instead of a specific user, and configurably give read or write access to them.

The approach to using these in GitHub Actions workflows is to generate a new SSH key locally, register its public key in the target repository, and then store its private key as a GitHub secret in your source repository.

The downside is that the deploy keys are designed for another use case entirely, and therefore lack some of the things we might want: they can't be used if you need multi-repo access, they can't be audited as they aren't tied to a user, and they can't be used to authenticate things like opening PRs. They also require your use case to support SSH keys instead of PAT auth. If they fit your use case though, they can be a great choice.

| Pros                                                                    | Cons                                                                |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------- |
| [+] Simple and easy to understand                                       | [-] Only works if your use case can use SSH keys                    |
| [+] Entirely GitHub-internal                                            | [-] Requires manual rotation, as they don't have unlimited lifetime |
| [+] Can be scoped to a particular repository                            | [-] Easily leaked by bad actors with access to the source repo      |
| [+] Can be managed by your DevOps team instead of individual developers | [-] Only works if you need access to _one_ repository               |
|                                                                         | [-] Can't be used for non-code access                               |

## Option 3 - Machine user-bound PATs

If you need to use PATs instead, the obvious solution to avoid binding it to a user account is to create a machine user in GitHub to generate it instead. This machine user can be managed by your DevOps team, and the teams that need PATs would then request them through your internal processes. The PATs would still be stored as GitHub secrets in the source repository, but they would be set by your DevOps team.

This works around the problem of users leaving the org, and still support fine-grained PATs for the specific needs. Additionally, since your DevOps team presumably manages their machine users and PATs through some kind of IaC process, rotation and management of the PATs can happen fairly easily -- without relying on individual developers in your org doing the right thing.

The downside is that this introduces a dependency on your DevOps team doing manual work (either approving a PR into an IaC repo that then sets everything up, or by doing it manually), and requires you to create a lot of machine users in GitHub. Machine users aren't particularly well supported by GitHub -- they prefer pushing GitHub Apps -- so it quickly becomes a bit of a mess. None the less, if your organization already uses machine users extensively, this is an obvious step to reach.

| Pros                                                                                    | Cons                                                                             |
| --------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| [+] Simple and easy to understand                                                       | [-] Requires machine users, which are poorly supported by GitHub                 |
| [+] Supports automated PAT rotations, if your DevOps team sets it up                    | [-] Introduces a dependency on your DevOps team to create PATs                   |
| [+] Can be scoped to the specific workflow needs                                        | [-] Requires more work of your DevOps team, usually by setting it an IaC process |
| [+] PATs and rotations are managed by your DevOps team instead of individual developers |                                                                                  |

## Option 4 - DevOps-owned reusable workflows

Another approach similar to machine user-bound PATs is to generate a single machine user, with a PAT that has permission to everything in the org, but then only allow access to it through reusable workflows provided by your DevOps team. Since reusable workflows are GitHub Actions jobs, any secrets pulled inside them (e.g. from AWS Secrets Manager using OIDC auth on the job workflow ref) are cleared before control is given back to the calling workflow.

This allows your DevOps team to do the work of creating and rotating the PAT once, and then having the various developers use the reusable workflows provided by your DevOps team instead of creating their own workflows and auth setups. If the reusable workflows have been designed properly, the developers won't be able to easily leak the access token, so the risk of a security breach are lower (although the impact of one is higher, given the wider permissions of the PAT).

The downside is that your DevOps team now has to create reusable workflows that can be used for _any job that needs auth in your org_. Depending on your needs this might be a huge task, that introduces your DevOps team as blockers for the work of your developers. GitHub Actions are usually difficult to exactly tailor to the needs of many teams, so use this option with care.

| Pros                                                                                         | Cons                                                                                                    |
| -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| [+] Slightly more complicated                                                                | [-] Forces your DevOps team to create reusable workflows for _all_ workflows that need auth in your org |
| [+] Security is managed by your DevOps team, as developers can no longer easily leak the PAT | [-] Introduces your DevOps team as blockers for a lot of CI work                                        |
| [+] Single place for auth sotrage makes it easier to rotate for your DevOps team             | [-] PAT can't be scoped to the specific needs of each workflow                                          |

## Option 5 - GitHub App-generated short-lived tokens

The great big final solution, which we have ended up reaching in my current organization, is to build out a GitHub App that generates [short-lived installation tokens](https://docs.github.com/en/rest/apps/apps?apiVersion=2022-11-28#create-an-installation-access-token-for-an-app) on-demand. This consists of registering a GitHub App in your organization with access to the repositories you need, and storing its auth in an external system that you design (in our case an AWS Lambda function). That external system is designed to receive [an OIDC token](https://github.com/actions/toolkit/tree/main/packages/core#oidc-token) from workflows along with the name of the repo they want access to, validate that the source repository should be allowed to access the target repository, and then generate a scoped installation token to send back. This allows workflows to request short-lived tokens on-demand.

This is a significantly more complex system, and requires you to design a security model that manages which repositories can access what repositories with some set of permissions (in our case we require the target repository to contain a file explicitly listing the repos that can have access). It's a system you'll have to design yourself (or piggyback on [someone who has already done the work](https://github.com/qoomon/actions--access-token)), because GitHub doesn't come with it built in, which also means you'll be introducing a single point of failure to your workflows. The upside is that you no longer have long-lived PAT tokens floating around your system.

This approach can also be combined with the reusable workflows approach from above, if the OIDC token is verified to have a job workflow ref from your DevOps-managed repository.

| Pros                                                                                               | Cons                                                      |
| -------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| [+] Tokens are short-lived and automatically revoked                                               | [-] Requires an external custom-designed setup            |
| [+] Tokens are scoped, with limited impact if leaked                                               | [-] Far more complex, with a custom security model        |
| [+] Security is managed by your DevOps team, but with great flexibility of use for your developers | [-] The external system becomes a single point of failure |

## Conclusion

Every approach to this problem presents a trade-off between simplicity, security and scalability. If your requirements are simple and involve minimal risk, a user-bound PAT or deploy key might suffice. For organizations prioritizing security and flexibility, setting up a GitHub App with short-lived tokens, potentially combined with reusable workflows, can offer robust control, though with added complexity.

In the DevOps team at my current organization we've chosen to implement a GitHub App for on-demand token generation. This offers the best trade-off for our specific situation, and has been received very well by developers -- but it's important that you are aware of the options you have.
