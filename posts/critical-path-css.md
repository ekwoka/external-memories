---
title: Unclogging the Critical Render Path
description: "Small changes made to how things load can have a significant impact on pagespeed performance. In this, we'll be taking a look at Critical CSS"
date: 2021-05-10
banner: /img/critical-header.png
tags:
  - CSS
  - Javascript
  - Pagespeed
layout: layouts/post.njk
---
Pagespeed is the bane of most web developers existence. You can build amazingly beautiful and feature packed websites and web-apps and have performance fall to crap, especially on that first load, by not paying attention to how the assets are loaded.

Most users to ecommerce sites are first time and periodic visitors, and will butt up against these issues quite often.

And that's before the impact that page loading speed has on SEO.

So, here I'll be talking about some creative ways to handle one of the biggest render blocking aspects of web development, CSS.

## What is Critical CSS?
CSS Stylesheets are inherently render blocking. As styles dictate the appearance of elements on the site, the browser waits until all defined CSS is loaded and parsed before beginning the render the markdown to the user's display.

But, often times, most of that CSS is not related to the most pressing aspects of the user's experience, and this translates in a significant delay.

One of the best ways to tackle this is to inline critical CSS (those styles necessary for getting some content onto the page) directly into the main documents markup. Then, if you defer the loading of the full stylesheets through various means, you can get the browser to start rendering the markup quickly, providing the user with some indication that the page is loading, and then finish the page once the Stylesheets finish loading.

<img class="w-full max-w-xl mx-auto rounded-lg shadow-lg" src="/img/critical-header.png"/>

You can see in this image the difference between the conventional render blocking CSS, and with the critical CSS inlined and stylesheets deferred. 

This is on an 85th percentile Mobile connection, commonly labeled as 3G Fast in devtools and Webpagetest. Here, the version of the store with the critical CSS inline gets some content on the screen over an entire second before the one conventionally loading the stylesheets. There is a slight cost to getting the whole page up, but is extremely minor compared against that initial paint. 

Now, there are a few moving pieces to handle well to ensure the result is responsive, and functional. So we'll go through these one by one.

> Examples here will be demonstrated on a partially rewritten version of the Debut Shopify Theme.

## How to Defer Style Sheets
Inherently, stylesheets indicated with `link` elements are render blocking, as mentioned before. This means that the browser will find, sit and wait to download these before doing anything else. So the trick here is to get the browser to download the stylesheet without blocking the render, and then to apply the stylesheet after the file has downloaded.

This can be done rather simply:

<img class="w-full max-w-xl mx-auto rounded-lg shadow-lg" src="/img/stylesheet-defer.png"/>

### Why does this work?
This is simple. There are many different media types, in this case print, that stylesheets can apply to. When the current views media type matches to the media attribute in the `link` element, then the browser applies the stylesheet. 

One interesting behavior is that browsers are extremely indiscriminate in their downloading of these stylesheets, so even when the media type does not match to the current view, the stylesheet downloads regardless, so as to be applied in the event the viewing context changes.

Then, once the file is downloaded, we use a little javascript to change the files media type to 'all' encouraging the browser to now apply these styles to the current viewing context.

Easy, right?

Let's see where that gets us.

<img class="w-full max-w-xl mx-auto rounded-lg shadow-lg" src="/img/flash-unstyled.png"/>

YIKES! That is pretty hideous.

This is what is called a "flash of unstyled content". Basically, where markup is rendered with only the default browser styles applied, and then the css loads and is applied afterwards. Naturally, it basically doens't work at all, and every user would hate this experience on every page load.

You may have occasionally experienced this when your connection cuts while you are loading a site. The CSS request fails, so the browser goes along with rendering the markup, and then tries the CSS again later and, BOOM, stuff gets pretty all of a sudden.

But how do we make sure the page still looks good when we get the render happening so early?

## How to Inline Critical CSS
This is the step of this process that has the most wiggle room to your personal tastes, and your development environment.

For Shopify, the easiest way is to have a separate file that you include as a snippet to the `head` of `theme.liquid`.

Then, in this file you gather up all the CSS used for that initial page load, specifically of the sitewide components, like the header, menu, and cart drawer. You could leave off the menu and cart drawer, but some users may want to start interacting with the options that they see available to themselves.

How I choose to handle the gathering of this CSS is fairly simple and straightforward. I use TailwindCSS as my CSS framework, so I simply use that to generate a minified critical render CSS and toss it into that extra snippet as I mentioned before.

<img class="w-full max-w-xl mx-auto rounded-lg shadow-lg" src="/img/critical-scripts.png"/>

This is how the `package.json` might look for this. Naturally, TailwindCSS is required, and PostCSS. Cssnano is used to minify the critical CSS to keep it small for that initial download.

Then the critical script purges the TailwindCSS using only the `header.liquid` and other critical liquid files for injection into the main theme layout.

How you might do this with your own development environment is up to you. I would recommend figuring a way to automate this, as doing it manually is a painstaking feat.

Okay, so now that that is done, where does that leave us, visually speaking.

<img class="w-full max-w-xl mx-auto rounded-lg shadow-lg" src="/img/inline-critical.png"/>

Okay, we're getting there. It's mostly ugly as hell.

At least the header looks pretty okay.

## Hiding Unstyled Elements
Next, of course, is to hide those unstyled elements.

Of course, the exact way you may choose to do this could vary by how your site is set up, but I'll go over the way the Debut theme does this by default.

But the core of it is that you include CSS in the critical CSS that hides those non-critical elements, and then you include, in the downloaded CSS file, CSS that makes those elements visible.

<img class="w-full max-w-xl mx-auto rounded-lg shadow-lg" src="/img/hide-noncritical.png"/>

With this, specifically, you can indicate to items that are not included in the critical CSS to hide with the `critical-hidden` class.

Additionally, automatically, this applies opacity 0 to the main section of the theme, which includes all page specific content.

This has a particular benefit when it comes to the handling of eagerly loading images.

When images are set to `display:none;` then they are not downloaded by the browser, but when they are simply set to `opacity: 0;` they will be, allowing the requests for these images to be sent even when not actually visible. This ensures that critical images will be loaded before or soon after the CSS finishes parsing.

When the CSS finally loads, these are set to being visible and the content comes into view.

> It's important to ensure your stylesheets are placed in the markup below the inlined critical css, otherwise they will not overwrite the inline styles hiding these elements.

So, we implement these changes and what is the result?

<img class="w-full max-w-xl mx-auto rounded-lg shadow-lg" src="/img/full-critical.png"/>

Now that's looking pretty good!!

Let's look back and compare all these different steps in the path to some nice Critical CSS Render Pathing:

<video class="w-full max-w-xl mx-auto rounded-lg shadow-lg"  id="player" controls="" muted="" preload="auto" poster="https://www.webpagetest.org/video/poster.php?tests=210509_BiDcMF_565f182391c1c3ce39f7ed33c6343f8f,210509_AiDc5C_a5a1b20dfceca556917704c03ab66ee6,210509_AiDcSM_f91454c46776c48fc32305dc935bef9e,210509_BiDcGX_698369494c4a8029ea61efbe1abdc50f&amp;bg=000000&amp;text=ffffff&amp;end=visual&amp;slow=1"><source src="https://www.webpagetest.org/video/video.php?tests=210509_BiDcMF_565f182391c1c3ce39f7ed33c6343f8f,210509_AiDc5C_a5a1b20dfceca556917704c03ab66ee6,210509_AiDcSM_f91454c46776c48fc32305dc935bef9e,210509_BiDcGX_698369494c4a8029ea61efbe1abdc50f&amp;bg=000000&amp;text=ffffff&amp;end=visual&amp;slow=1" type="video/mp4"></video>

Snappy and looking good!!