---
title: Shopify Products API for AlpineJS
description: Shopify's public API has a serious gap when it comes to accessing products. Luckily we can use alternative templates to build out a kind of imitation API right in the Liquid.
date: 2021-03-31
tags:
  - alpinejs
  - tailwind
  - shopify
  - javascript
layout: layouts/post.njk
---
While of course product pages and homepages serve an important role in an ecommerce sense, they're also fairly technologically simple.

This means they have less real benefit to be gained through a headless development state that AlpineJS enables.

Collections pages are significantly more complex, with lots of repeating elements and interactivity.

Naturally, if I want to check the viability of this planned Alpine Shopify Theme, I should start where the going is rough.

## Building for Modularity
While my initial goal is not to worry about creating a single page application, I do want to set myself up for success by building these "pages" as modules that could be inserted wherever needed, and then plugging them into the main page space of an otherwise normal shopify store.

In time, if my experiments work, I can then see about bundling them together into a single page application theme, provided I can tackle all the other issues inherent to such applications.

## Minimum Viable Product
To ensure I am not trying to shoot the moon out of the gate, I'm establishing our current themes existing features as the MVP for this collections page.

Mainly that it:
- Allows the use of a "Load More" button in place of pagination or infinite scroll, and
- Allows tapable color swatches to change the presented image for the item.

With this, we'd not be moving backwards, and we can then benchmark technical performance against the current theme.

### Wishful Features
There are of course some beneficial features we'd want to support in the long run. These include:
- color swatches change URL of Product link to include variation data to pass to the product Page,
- ability to resume the collection at a specific page, and "Load More" in reverse as well as forward, and
- a small progress indicator to help the user know their position throughout the collection list.

### The Work
This isn't going to be a tutorial. This is meant to be an exploration of my challenges and thought process in accomplishing this. If you're trying to learn from this, you'll still need to do some of your own reading of the documentation, but this might help draw attention to some of the more difficult or unintuitive bits.

I'm not a web developer, so getting this far on your own is totally manageable.

## Shopify Products to JSON
This bit will probably be the most unexpected bit. Shopify does not provide a public API for accessing their product list, at least, not entirely. `shopifystore.com/products.json` does return up to 250 items (via a `limit` query) but this is does not allow any real limiting of the scope.

In my case, the store I'm working with has 350 items, so just using that provided API would not get us to the gold. 

> Shopify does provide an Admin API to access many more items. This is how apps access all your products, but this is not usable on the actual store.

What I'd really like to do is be able to move in chunks through the product list to allow the list to populate progressively, as opposed to pulling a large list in at once to begin with. This should allow content to appear quickly and then have the list grow in the background, or simply be loaded as needed.

### Alternate Templates
Luckily, Shopify allows the creation of alternate templates, as well as many useful options on these to provide some unique results.

> The following is a bit of a "hack". This could stop working at any time as Shopify decides, although this does try to avoid areas where it could bypass Shopify's intended limitations.

We can use these alternate templates to produce a sort of custom API.

The easiest way is to just go into the theme files on Shopify and find the "Create new Template" tell it you want a collection template and it will put in the basics for that template.

In my case, I called the template `json` and this produced a `collection.json.liquid`.

To access this, on a collection page URL, you simply add `?view=json` and the collection will be generated following this new Template file.

From here, it's just about writing appropriate Liquid code to generate a JSON formatted list of objects.

```liquid
{%- layout none -%}
{%- paginate collection.products by 36 -%}
{
    "products":[
        {%- for prod in collection.products -%}
            {
                "id":"{{ prod.id }}",
                "title":"{{ prod.title }}",
                "tags":[
         
                ],
                "image":"{{ prod.featured_image | img_url: '720x' }}",
                "price":"{{ prod.price | | money_with_currency }}"
            }{%- unless forloop.last -%},{%- endunless -%}
        {%- endfor -%}
    ]
}
{%- endpaginate -%}
```

> Note: this code is incomplete compared to the full bit I am currently experimenting with and is just here to demonstrate how this works. Additionally I have identified areas to better improve the data structure.

One important thing to remember is the `{%- layout none -%}` as, without this, shopify will attempt to render this page contained within the rest of your theme files, instead of as a standalone file.

Now we can use normal fetch requests to this collection template to build out the information we will feed into AlpineJS to produce our collection page dynamically.

Of course, that's a story for next time.