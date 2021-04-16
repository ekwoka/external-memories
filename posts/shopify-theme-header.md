---
title: Creating a Shopify Theme Header
description: Part 2 in my documentation of my journey to making a fully custom Shopify Theme. I get the header put together with a few interesting tricks.
date: 2021-04-16
banner: /img/shopify-header-4.png
tags:
  - shopify
  - tailwind
layout: layouts/post.njk
---
I'm not a total idiot, so I plan to tackle this project in a fairly linear way: sitewide template first. I'll probably do the rest in a nonsensical but I'm starting this by making sense.

This allows me to become more acquainted with Shopify's theme structure as a whole and tackle small problems as they come.

## The Header
I don't intend to break down every little piece of how this goes together, just the interesting bits I hit along the way that required a bit more ingenuity than I had initially expected.

One of the bigger things that gave me some issue was ensuring that everything functions in a world where javascript is turned off, and not relying on users to have javascript enabled, despite the number of users with javascript off being excruciatingly small.

Of course, this is good design practice, but also it's a requirement for Shopify themes on the marketplace, so of course I might as well get it right from the get go.

Then, of course, next was the hassles of ensuring the theme can be customized in the theme editor and work purely as expected, even in the extremes.

## The Logo
A logo is rather important to a website of any kind, and many store owners will rightfully be overly concerned with how it presents. Furthermore, despite SVGs being the way logos should be presented, many will want to use images, so naturally I need to provide multiple options.

So I settled on an image option (with image picker), and SVG option (with html entry box) and Text (just the store name in normal text).

<img src="/img/shopify-header-3" class="w-full max-w-md mx-auto"/>

Naturally, none of these behave similarly, and providing a further option for customizing the presented width of the logo in question adds additional issues.

I settled on using some inline CSS at the beginning of the header section to defined some shared width and height data for the image logo (if selected) to keep it from getting squashed or running amok outside of it's designated place.

<img class="w-full max-w-md mx-auto rounded-lg shadow-lg" src="/img/shopify-header-img.png"/>

By comparison, the text and SVG versions were entirely straight forward.

## Conditional Sticky Class
Another common feature stores want for various reasons (and to varying degrees of success) is a sticky header, so of course, I might as well support this.

One sticking point, however, is that the sticky property needs to be put on the very first point of stickiness, so as to have it stick appropriately over siblings.

With Shopify sections, these are dynamically generated `div` elements, so we can't directly apply conditional classes or styles.

What I came up with was to instead use the section schema to apply a class to the section, and then conditionally define that class as being sticky at the beginning of the section.

Schema:
<img class="w-full max-w-md mx-auto rounded-lg shadow-lg" src="/img/shopify-header-schema.png"/>

Inline CSS at start of section:
<div x-data="img()">
<img class="w-full max-w-md mx-auto rounded-lg shadow-lg" src="/img/shopify-header-sticky.png" @click="show-code-3 = true"/>
	<div class="overflow-hidden; max-w-md w-full rounded-lg shadow-lg bg-gray-700 text-gray-100" x-show="show-code-3" style="display:none;" x-text="code-3"></div>
</div>

<script>
	function img() {
		return {
			img: num,
			
			code-3: '{% if section.settings.sticky == true -%}

.header-sticky {
	position: sticky;
	top: 0;
	z-index:15;
}

{% endif %}',
			show-code-3: false
}
	}
</script>