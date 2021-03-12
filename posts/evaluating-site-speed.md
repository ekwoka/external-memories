---
title: Slow Pages are Costing Your Money (Give Back Your Customer's Time)
description: Speeding up your store's page speed is the surest way to improve conversions, but most people don't know the first place to start with diagnosing the problems.
date: 2021-02-25
tags:
  - Shopify
  - Developer
  - Page Speed
layout: layouts/post.njk
---
It's common advice given to fresh store owners to keep their page loading quickly, but the actual mechanics of getting this done are generally glossed over. This may be for good reason, as the specifics do get rather technical and require a fairly talented developer to handle.

But understanding more of how it all works can be beneficial to UX designers and product owners alike.

## The Benchmark

So what is a good page speed? And what's the cost of going over that speed?

A great benchmark to start from is that every second of load time over 3 seconds is costing 7% of potential conversions.

From here we can see the benefits of improving page speed.

For example, if we have a store making $100,000 in revenue in a year, with a page speed of 5.4 seconds, the equation would look like this:

$$100,000 * 1.07^{(5.4-3)}-100,000 = ~17,600$$

The costs of slow loading pages can really add up quickly.

## How to Measure Pagespeed
So, sure, 3 seconds is great and all, but how do we even measure this? Every pagespeed tool anyone can recommend comes back with all kinds of different information, and possibly dozens of timers showing different measurements.

Unfortunately, there is no perfect measurement of pagespeed to use, so the most important thing is being consistent in your own measuring to see if there are improvements or not.

Before we get into all the different metrics and what they mean, let's run an actual pagespeed test so we can go over this together. We'll do our test on [Alo Yoga](https://aloyoga.com)

### [Web Page Test.org](https://webpagetest.org)
This tool is my favorite, and provides a lot of meaningful insights. It is run by an ex-Googler, and is designed really for developers. Many other tools exist to try to make this more accessible, but they often leave off a lot of helpful aspects that webpagetest just gets right.

#### Settings to Use
Let's start by just putting `aloyoga.com` right there in the test URL, and then take a look at the settings.

These are the settings I recommend for getting results that will provide some real insights.

```js
Location: "London" //choose server nearby to main customer base
Browser: "Chrome"

Advanced Settings:
Connection: "3G Fast - 1.6mbps, 150ms RTT" //Benchmark on common user connection
Tests to Run: 3 //Three Minimum
Repeat View: "First View and Repeat View" //compare first visit with cached experience
Capture Video: Y //Just do it.

Chromium:
Emulate Mobile Browser: "Samsung Galaxy S8" //iPhone or S8
Capture Devtools Timeline: Y
```

This may take a little while to complete so take a sit back. Or you can just go [HERE](https://webpagetest.org/result/210222_DiVF_b3573f3062e1c11fd48f47dbc2cd7ff9/1/details/#waterfall_view_step1) where I've already run this test.

### Evaluating the Results
Woah boy is Alo Yoga a slow site!

Now, a lot of this is from the connection throttling for a fast 3g connection, but that's still a very common connection speed outside of big cities (and even inside some). Alo is totally neglecting these users! The whole page is over 14MB, and it's taking 14 seconds just to get to the Largest Contentful Paint (LCP). Okay, okay, there's a lot going on here, but let's break it down!

#### Time to First Byte (TTFB)
This is mostly the server and connection response time. When the user initiates the connection, how long until the first bit of data gets back to them.

In this case it's nearly 3 seconds for Alo. That is *TERRIBLE*!! This should really be under 800ms, even with the extra latency of a mobile connection.

This time is made up of the delay in the users connection, as well as all the server-side processing Shopify needs to do.

Shopify actually builds every page per user request from the template files. When this code is efficient, the servers can generate pages in as little as 200ms, but poorly handled code can easily bloat this up. Things like nested loops can create an N+1 problem resulting in exponential slowdowns.

Shopify recommends working to keep the liquid rendering time down to just 500ms, to help get data back to the users quickly.

Shopify provides a nice [Chrome extension](https://chrome.google.com/webstore/detail/shopify-theme-inspector-f/fndnankcflemoafdeboboehphmiijkgp) to help audit wild Liquid coding. Just log in to your store and then use the new `Shopify` tab in the Chrome Devtools to help identify bits of Liquid code that are hanging up the process as well as get detailed information on the total server-side render time of the page you're on.

But, provided your TTFB is at or around 800ms, there likely isn't much you'll be able to do to improve this. 

##### What Alo did wrong!
In this case, it isn't the Liquid rendering that is causing issues for Alo Yoga. Instead it is all about their SSL settings.

Now, this is a very rare problem to have, so I won't get too out in the grapes regarding this or how to fix it, but just discussing how to identify it.

**SSL Problems**
`https` is a kind of secure protocol for accessing things online. It ensures that the connection between you and the server is safe and encrypted.

Part of this relies on SSL certificates to verify that the server being accessed is the real server, and not someone pretending. These need to be processed and verified before the client will accept an https connection.

For some odd reason, Alo, despite being on Shopify, is using a totally different SSL certificate issuer than every other Shopify site I could find, and that issuers servers are slow.

The client spends 853ms trying to get verification of the certificates from the issuer. This is insane. I hope that's just a temporary issue and not normal.

These connections for the SSL certificates are shown as the first 2 connections in this case, and you can see that the fifth item, the actually site, is just waiting for all of that to be done before the client can start accessing the real site.

Alo Yoga's revenue is estimated to be nearly $60 million a year. Just fixing these DNS and SSL issues could translate into an additional $10 million in revenue!!

> Alo Yoga, I'll gladly fix these issues for you for just a measely $3million. That's a solid 3x ROI! Think about it!

#### 