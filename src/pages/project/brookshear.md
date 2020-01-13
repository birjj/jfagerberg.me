---
title: Brookshear Machine
description: A Brookshear Machine emulator, useful for teaching the basics of CPU instructions and low-level programming.
href: https://brookshear.jfagerberg.me/
icon: brookshear
date: 2017-09-01
technologies:
    - React
    - Mobx
    - ES6
type: project
---

This Brookshear Machine emulator is currently in use in the introductory courses at University of Southern Denmark and James Madison University. It serves as an interactive introduction to computer architecture, implementing the machine language invented by Dr. Glenn Brookshear.

The project was started while I was taking these courses myself, as I had grown dissatisfied with the usability of the available emulators at the time. The emulator was built over roughly a week, and served as my first proper application built using React.

Mobx was chosen for state management, as the concept of an emulator lends itself well to the observable state principle that powers Mobx. Overall this choice resulted in mostly painless state management without all the boilerplate that comes with other state management solutions like Redux.

The emulator can be tried live [on its website](https://brookshear.jfagerberg.me/), which includes an overview of the machine language and the available operations.
