---
title: Using GitHub Actions to automate testing and publishing of PowerShell modules
date: 2022-12-16
tags: ["automation", "powershell"]
draft: true
---

> **Warning**  
> This blog post is currently unfinished. It is still published, because its current state might be valuable to others.

I've recently had to dip my toes into PowerShell module development. Being far from an expert on PowerShell or the community around it, I found it a bit daunting to setup my module development space for the first time. For the sake of saving you (and me) the trouble of going through that again, I'll be describing my module development setup here. This will largely focus on the actual code layout, and not so much on the PowerShell code.

## Project goals

I found that all the project templates I could find lacked a few things that were important to me. These include:

- Automate where possible, including automatic testing (CI) and deployment (CD). As little publishing-related stuff should happen on my local machine as possible.
- Easily write-able and run-able tests. The chore of writing tests for modules should be simplified as much as possible, with easy ways to unit test both private and public functions.
- As little code-duplication as possible. If I've written something once, I shouldn't have to copy-paste the file over to every new project I create (which would cause problems when I later have to update it).

Given these requirements, [Catesta](https://github.com/techthoughts2/Catesta) appeared to be the project template that got closest - with a few changes required.

## Initial project setup

Before setting up, you'll have to decide on whether you want a monorepo, or want to use a new repository for each module. The differences are rather slight, mostly revolving around how contributions happen to each module; but in my case I found that a lot of my modules were related to eachother, and as such chose to use a monorepo, with each project being represented by a folder in a shared repository.

Setting up the basic project for a module is simple enough, using Catesta to provide the boilerplate:

```powershell
# install Catesta from the PSGallery
Install-Module -Name Catesta -Repository PSGallery -Scope CurrentUser
# run Catesta to set up a new project
# when run this will prompt you for some basic information: the name of the module, a description, etc.
# choose the options that work best for you; I usually do changelog and GitHub files, MIT license, OTBS coding style and platyPS for documentation
New-PowerShellProject -CICDChoice 'GitHubActions' -DestinationPath './Module-Name' # you can just use `-DestinationPath '.'` if you aren't doing the monorepo thing
```

This will set up a general module structure for development. While this structure largely fit my needs (and has been designed by people much smarter than me), I did find that I needed to make a few changes:

### `actions_bootstrap.ps1`

This is a file Catesta sets up to install the necessary modules. However, I found that not only was this file incredibly slow when ran in a CI environment, as it forced installs of modules even if already installed, but it would also sometimes continue execution even if installation of a module failed (e.g. if you had a PowerShell instance open with one of the modules imported). I added the following to improve on it:

```powershell
'Installing PowerShell Modules'
foreach ($module in $modulesToInstall) {
    $updateSplat = @{
        Name            = $module.ModuleName
        RequiredVersion = $module.ModuleVersion
        Force           = $true
        ErrorAction     = 'Stop'
    }
    $installSplat = @{
        Name               = $module.ModuleName
        RequiredVersion    = $module.ModuleVersion
        Repository         = 'PSGallery'
        SkipPublisherCheck = $true
        Force              = $true
        ErrorAction        = 'Stop'
    }
    $curVersion = Get-Module $module.ModuleName | Select-Object -ExpandProperty Version -Last 1
    if ($curVersion -eq $module.ModuleVersion) {
        "  - Already installed $($module.ModuleName) ${curVersion}, skipping"
        continue
    }
    try {
        if ($curVersion) {
            "  - Updating to $($module.ModuleName) $($module.ModuleVersion) (from old version ${curVersion})"
            Update-Module @updateSplat
        } else {
            "  - Installing $($module.ModuleName) $($module.ModuleVersion) (not previously installed)"
            Install-Module @installSplat
        }
        Import-Module -Name $module.ModuleName -RequiredVersion $module.ModuleVersion -ErrorAction Stop
        $newVersion = Get-Module $module.ModuleName | Select-Object -ExpandProperty Version -Last 1
        if ($newVersion -ne $module.ModuleVersion) {
            throw "New version ${newVersion} does not match expected $($module.ModuleVersion)"
        }
        '  - Successfully installed {0}' -f $module.ModuleName
    } catch {
        $message = 'Failed to install {0}' -f $module.ModuleName
        "  - $message"
        throw
    }
}
```

### `src/PSScriptAnalyzerSettings.psd1`

This file is used to configure the PowerShell linter [PSScriptAnalyzer](https://github.com/PowerShell/PSScriptAnalyzer), which runs every time we build to module. While the defaults set up by Catesta are nice, I did find that there were some rules that caused more problems than they solved. In particular, I added the following:

```diff
@{
    # ...
    #ExcludeRules
    #Specify ExcludeRules when you want to exclude a certain rule from the the default set of rules.
   ExcludeRules        = @(
+       'PSAvoidUsingWriteHost',                       # I often create modules that write user-facing information, instead of programmatic output
+       'PSUseSingularNouns',                          # If I'm working on functions that take lists of items, I want to use plural nouns
+       'PSUseShouldProcessForStateChangingFunctions'  # The heuristic for when to apply this rule is simply too poor, making it unusable
    )
    # ...
}
```

### `src/Module-Name/Module-Name.psd1`

Modifying this file is actually a requirement by Catesta. It contains the module manifest that will be used by PowerShell and PSGallery to understand the module, and contains a few crucial fields that must be set manually:

<dl>
<dt><code>FunctionsToExport|CmdletsToExport|VariablesToExport|AliasesToExport = '*'</code></dt>
<dd>Contains a list of the functions, cmdlets, variables or aliases the module exports. The default value <code>'*'</code> is not good practice, and will throw an error in the linting stage. Update these as you develop the module (e.g. <code>'Foo','Bar'</code>), or set them to the empty list <code>@()</code> if you have none to export.</dd>

<dt><code>PrivateData.PSData.ProjectUri</code></dt>
<dd>Contains a link to the main website for the project, which will be shown on the PSGallery page. Will throw an error in the linting stage if not set. Usually I set this to the link of the repository on GitHub, linking directly to the sub-folder of the module if I'm using a monorepo.</dd>
</dl>

## Building the module for the first time

Once the above changes are done, we'll want to test that the build process still works:

```shell
$ .\actions_bootstrap.ps1
Installing PowerShell Modules
  - Already installed Pester 5.3.3, skipping
  - Installing InvokeBuild 5.10.1 (from old version 5.9.9.0)
  - Successfully installed InvokeBuild
  - Already installed PSScriptAnalyzer 1.21.0, skipping
  - Already installed platyPS 0.12.0, skipping
$ Invoke-Build -File .\src\ModuleName.build.ps1
# ...  output removed for clarity
Build succeeded. 18 tasks, 0 errors, 0 warnings 00:00:12.3459517
```

Depending on whether or not you've implemented your module, you might have a failing test - this is intentional from the Catesta template we used to generate the project. Fixing it is a good introduction to how the project is set up.
