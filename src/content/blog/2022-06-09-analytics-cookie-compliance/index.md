---
title: Do cookie-free analytics need cookie compliance popups?
date: 2022-06-09
tags: ["analytics", "privacy"]
---

It might sound like a bit of a weird question; if we don't use cookies, surely there's no way we'd be violating cookie laws. That's why it was surprising to me to learn that we actually do: if we want to be in compliance with the EU's ePrivacy Directive (commonly called the cookie law) without using cookie banners, we'll need to meet far stricter criteria than just "not using cookies". Keep reading for a deep dive.

## Technical background

In recent years there has been an increased focus on online privacy and how our data is handled when we browse the web. This comes in the wake of the massively privacy-invading tracking done by companies like Google and Facebook becoming public knowledge, of EU legislation forcing companies to get informed consent before processing our data, and of better privacy tools becoming easily available in our browsers.

This has driven a heightened demand for "privacy-aware analytics", a term reserved for analytic solutions that aim to anonymize the collected data enough that it is no longer considered private data. An early example is [Fathom](https://usefathom.com/), but other self-hosted solutions like [Plausible](https://plausible.io/), [Ackee](https://ackee.electerious.com/), and [Counter](https://counter.dev/) have also started popping up.

Privacy-aware analytics are faced with an obstacle: most analytics requires some way to recognize repeat visitors. Since HTTP is stateless, knowing whether a user has visited before (to count how many unique visitors we've had), visited another page (to calculate bounce rate), and when they left (to calculate average visit duration) requires some kind of user tracking. Traditionally this has been done by storing a small token - in the form of a cookie, usually - on the user's device, which their browser then attaches to future requests. The analytics backend can then compare that to a list of previously seen tokens, and thereby know whether the user is new or has visited before.

Cookie-free analytics work slightly differently. Instead of storing a small token on the user's device, the backend instead calculates a unique token when the request comes in based on the user's available data. This process - known as [fingerprinting](https://amiunique.org/) - allows the analytics solution to skirt any legislation that limits when data can be stored on a user's device, and often works just as well as cookie-based tokens. Privacy-aware analytics usually combine this concept with a significant focus on privacy and extends it with things like hashing, rotating salts, and limited fingerprint data (for more information see [Fathom's great explainer](https://usefathom.com/blog/anonymization) on their algorithm). This generally produces what most people would consider anonymized data: in almost all situations it is impossible to trace any data back to the individual user, especially once the salt has been rotated.

While this implementation is enough to satisfy even me when it comes to respecting users' privacy, it also causes a common misconception: namely that since it is a privacy-aware analytics solution that doesn't use cookies, we don't have to ask users for consent. To work out whether that's true, we'll have to look at why we ask for consent in the first place.

## A bit of legal background

_Note: I am not a lawyer. The following is my simplistic understanding of the relevant legislation. Do not use it as legal advice_

When we're talking about analytics there are primarily two different EU laws we'll need to cover: the big baddie, GDPR, and the older cookie law, the ePrivacy Directive. These two both relate to data privacy and are often confused, so here's a quick breakdown:

<dl>
<dt><a href="http://data.europa.eu/eli/reg/2016/679/oj">GDPR [Regulation (EU) 2016/679]</a></dt>
<dd>Regulation adopted in 2016, came into force in 2018.<br>Huge law primarily addressing the right of an individual to control their <em>personal data</em>. Trivial examples include names, birthdays, and emails; more complicated examples include browsing history, timestamps, and preferences. If there is any theoretical way that data can be traced back to a person, that data is probably covered by GDPR.<br>GDPR is a huge beast and one that I am far from competent enough to cover. I will be assuming that the analytics solution you're looking to implement already strongly anonymizes all data, and therefore won't cover GDPR further.</dd>
<dt><a href="http://data.europa.eu/eli/dir/2002/58/2009-12-19">ePrivacy Directive [Directive 2002/58/EC]</a></dt>
<dd>Directive from 2002, later amended in 2009.<br>One of the early attempts at legislating online privacy. Of interest to us is its regulations on what data can be processed for what uses without requiring informed consent from the user.<br>Enforces privacy of any data read from a user's device, <em>personal or not</em>. This will be especially important for us, as it limits us greatly in what data we can use, even if we anonymize it heavily.<br>Note that this is a directive, not a regulation, meaning it is up to the individual EU countries to implement the directive into law. This distinction isn't that important for our uses, and I will only be considering the wording of the directive itself in this article.</dd>
</dl>

We'll be focusing our efforts on the cookie law since the consent required by GDPR can be largely skirted around by anonymizing data properly.

Two common misconceptions of the cookie law are that 1) it only applies to data stored in cookies, and 2) that it only applies to personal data.  
As put in Article 5(3) of the ePrivacy Directive:

> [...] the storing of information, or the gaining of access to information already stored, in the terminal equipment of a subscriber or user is only allowed on condition that the subscriber or user concerned has given his or her consent [...]

This covers information stored in cookies, information stored in local storage, and even (as we shall see later) information previously stored on the device by others, such as browser user agents. We therefore can't skirt the legislation by simply using other storage mechanisms, despite the unofficial "cookie law" misnomer.  
The directive also doesn't have any exceptions for anonymized data. As put by the EU Data Protection Working Party in [a 2014 opinion on anonymization](https://ec.europa.eu/justice/article-29/documentation/opinion-recommendation/files/2014/wp216_en.pdf), _"anonymisation is a technique applied to personal data in order to achieve irreversible de-identification. Therefore, the starting assumption is that the personal data must have been collected and processed in compliance with the applicable legislation on the retention of data in an identifiable format."_ This means that the simple act of accessing the data in the first place is restricted.

If we look at [the algorithm used by Fathom](https://usefathom.com/blog/anonymization), we see that it collects the following information for fingerprinting: IP address, user agent, site domain name, and site ID. Two of these can be accessed without relying on the user's device: the site domain and the site ID. The IP address and user agent, as we'll see below, are explicitly covered by the ePrivacy Directive, and therefore require user consent to access. This means that even if we use Fathom analytics, even despite its cookie-free and privacy-friendly design, we'll _still_ need a cookie banner to get user consent.

A similar story is true for [Plausible's algorithm](https://plausible.io/data-policy). It collects the following information: IP address, user agent, page URL, and referrer. Here the IP address, user agent, and referrer require consent according to the ePrivacy Directive, so we are in exactly the same boat as with Fathom: privacy-aware and cookie-free or not, a cookie popup is legally required. Even the people behind Plausible seem to be confused here, using (at the time of this writing) "No need for cookie banners or GDPR consent" as one of the titles on their landing page.

Every other privacy-aware analytics solution I've found, including [Ackee](https://github.com/electerious/Ackee/blob/master/docs/Anonymization.md) and [Counter](https://github.com/ihucos/counter.dev#how-can-it-be-free), also uses data covered by the ePrivacy Directive.

## So can we fingerprint people at all without cookie popups?

Let's have a look at the various data points we can use to identify repeat visits, and what the ePrivacy Directive says about them:

<dl>
<dt>IP address or other traffic data</dt>
<dd>Covered by the Directive under traffic data:

<blockquote>(26) The data [...] processed within electronic communications networks to establish connections and to transmit information contain information on the private life of natural persons [...]. Such data may only be stored to the extent that is necessary for the provision of the service for the purpose of billing and for interconnection payments, and for a limited time. Any further processing of such data [...] may only be allowed if the subscriber has agreed to this on the basis of accurate and full information given by the provider [...]. Traffic data used for marketing communications services or for the provision of value added services should also be erased or made anonymous after the provision of the service. Service providers should always keep subscribers informed of the types of data they are processing and the purposes and duration for which this is done.</blockquote>

Not only does this require us to get consent before processing a user's IP address, but it also requires us to immediately anonymize it (if we weren't already). This covers all traffic data regardless of how it is accessed. You can of course use still use the IP address for traffic purposes, but anything else requires informed consent.

Since things like GeoIP lookups use the IP address and therefore require accessing it first, using a user's country or city is also covered.

</dd>

<dt>Screen size, browser version and other client data</dt>
<dd>Covered by the Directive as data that has previously been stored by the browser vendor or device manufacturer, which we then access. As put by the EU Data Protection Working Party in <a href="https://ec.europa.eu/justice/article-29/documentation/opinion-recommendation/files/2014/wp224_en.pdf">a 2014 opinion on fingerprinting</a>:

<blockquote>Information that is stored by one party (including information stored by the user or device manufacturer) which is later accessed by another party is therefore within the scope of Article 5(3). [...] The consent requirement also applies when a read-only value is accessed (e.g. requesting the MAC address of a network interface via the OS API).</blockquote>

In the same opinion, they also cover the act of fingerprinting using HTTP headers, using the User-Agent header as an example, but do not specifically mention it as requiring informed consent.

</dd>
<dt>User-Agent, Referer, and other HTTP headers</dt>
<dd>It could be argued that reading these headers isn't gaining access to data stored on the user's terminal equipment. However, these headers are specifically designed to allow tailoring of a response to the requester, and are sent for the purpose of allow the server to transmit the correct data (as described in <a href="https://httpwg.org/specs/rfc7231.html#header.user-agent">the specification</a>).

Since the ePrivacy Directive defines traffic data as being <em>"any data processed for the purpose of the conveyance of a communication on an electronic communications network or for the billing thereof"</em>, this means these HTTP headers also require informed consent.

</dd>

<dt>Any data stored by third parties (or us)</dt>
<dd>This is trivially covered by Article 5(3) of the Directive, which we have covered already:

<blockquote>[...] the storing of information, or the gaining of access to information already stored, in the terminal equipment of a subscriber or user is only allowed on condition that the subscriber or user concerned has given his or her consent [...]</blockquote>

As pointed out by the Working Party in the previously quoted [opinion on fingerprinting](https://ec.europa.eu/justice/article-29/documentation/opinion-recommendation/files/2014/wp224_en.pdf), this includes information stored by the user themselves or by device manufacturers - not to mention third parties. It blocks essentially all direct tracking, as it is intended to.

</dd>
</dl>

This leaves us with very few, if any, data points left to use for fingerprinting without asking the user for informed consent. While this is certainly a win for privacy when it comes to companies that are interested in finding loopholes that let them track users, it does extinguish any hope we have of escaping the popup nightmare the web has become today.

## So what _can_ we use cookies for?

Just because we cannot _track_ users using any sort of data without consent doesn't mean we need consent to use cookies. As put by article 5.3: _"[the restrictions] shall not prevent any technical storage or access for the sole purpose of carrying out the transmission of a communication over an electronic communications network, or as strictly necessary in order for the provider of an information society service explicitly requested by the subscriber or user to provide the service."_.

The first part, using stored or accessed data for the sole purpose of transmission, allows us to store information we may need to send information to the correct place (e.g. an assigned server when using load balancing). The second part, using stored or accessed data to service an explicit request by the user, allows us to use cookies for many of the common website tasks we have, such as tracking whether a user is logged in, what they have in their cart on e-commerce sites, and how far they've come in questionnaires.

For each of those cases it is important to notice that we _cannot_ use the information for anything other than the legitimate use outlined above: just because we use a cookie to track whether a user is logged in doesn't give us a free pass to also use that cookie for tracking purposes.

If you are interested in a more in-depth analysis of when these exemptions apply, the EU Data Protection Working Party released [an opinion on exemptions](https://ec.europa.eu/justice/article-29/documentation/opinion-recommendation/files/2012/wp194_en.pdf) in 2012 (with examples) where they delve deeper into it. I can highly recommend reading it. It even includes a specific analysis of first-party anonymized analytics, concluding that _"While they are often considered as a 'strictly necessary' tool for website operators, they are not strictly necessary to provide a functionality explicitly requested by the user [...]. As a consequence, these cookies do not fall under the [exemptions]"_ (although the working group recommends that if Article 5(3) is revisited, an exemption for them could be granted - this has not happened at the time of writing).

## Conclusion

Although it might come as a surprise (it certainly did for me), privacy-aware and cookie-free analytics aren't going to save us from cookie banners with the way the legislation is currently written. If you are interested in avoiding cookie popups on your website, there, unfortunately, aren't any useful analytics solutions that will legally allow that. Whether that is good or bad certainly depends on perspective: user privacy has taken huge strides, and its protection is important. At the same time, even the EU Data Protection Working Party has conceded that first-party anonymized analytics might be worth an exemption. But since this exemption has not yet been implemented, there is only one conclusion possible:

Like it or not, the cookie banners are here to stay.
