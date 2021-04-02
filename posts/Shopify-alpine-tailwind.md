---
title: Getting Started with Alpinejs and TailwindCSS
description: A bright new future looks of powerful and responsive Shopify stores. It will just take some learning to get working.
date: 2021-03-16
tags:
  - shopify
  - alpinejs
  - tailwindcss
layout: layouts/post.njk
---
Not being a web developer myself, I'm rarely in the loop in regards to new technological developments. I try to stay abreast of major changes to Shopify and the W3C standards for CSS and markup, but rarely does this extend to overall development frameworks.

Of course, my javascript is also very rusty, and it wasn't very functional to begin with.

But recently I've been very excited to learn about [TailwindCSS](https://tailwindcss.com/) and [AlpineJS](https://github.com/alpinejs/alpine).

## Utility First
At their core, Tailwind and Alpine exist to expand the function of your markup, as opposed to put convoluted layers in the background. TailwindCSS calls this "utility-first css", where the bulk of common styling is handled via highly reusable utility classes, as opposed to the more classical sementic classes.

This puts more power in your markup, making maintenance on a large code base much simpler.

Alpine is somewhat similar, but for Javascript, where the goal is to put more control over functions and interactions directly into the markup, with the help of very lightweight background scripting.

## Easy to Maintain
All that may be right over your head, but the real impact is that your webapp or store can be more responsive and more maintainable.

One of the hardest things with Shopify development is how many hands often end up in the cookie jar so to speak.

By the time clients make it to us, their stores have often accumulated so much technological debt that we can never really catch up. All this comes from a combination of initial theme developers, freelance developers, apps, and even store owners copying and pasting code.

Most of the individual pieces are fine, or at least not meaningfully broken, but it combines together to mean lots of inconsistency and conflict.

However, when developing with AlpineJS and TailwindCSS, so much of the style and function is right in the markup itself, or isolated in specific named functions.

This means no running all around trying to figure out why X thing behaves in Y way or running into conflicts with a script tucked away in some dark corner.

## A New Era for Shopify Themes
I've already been toying with the idea of creating my own Shopify Theme, and this just really gives me the ammo to offer something meaningfully different. This falls right into my current seasonal theme, the Spring of Creation.

With that in mind, I've been messing about with Tailwind and Alpine on [codepen](https://codepen.io/ekwoka/pen/VwmRJXP) to see how I might handle a dynamic collections page with filters.

The biggest issue is just Shopify not making it easy to access a lot of products through JSON, but there are some ways around it.

That is a story for another time.
