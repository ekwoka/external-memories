---
title: Putting Together a Collection Page with AlpineJS
description: Tossing a headless collections page together with alpineJS is surprisingly easy for a dummy like me.
banner: /img/alpine-based-collection.png
date: 2021-04-03
tags:
  - shopify
  - alpinejs
layout: layouts/post.njk
---
I talked a bit in my last post about getting a basic makeshift product API into existence that we can use to present the information we want, structured how we want it, and able to be navigated through in a natural manner like a collections page.

## Actually Putting the Collection Together
A bit of this was done a few weeks ago, but for toying with this idea I used Codepen and installed AlpineJS and TailwindCSS through that to use.

My initial test was [excruciatingly basic](https://codepen.io/ekwoka/pen/VwmRJXP) and used just the normal Shopify Product API. But it functioned.

But let's just assume we're already going to be using our customized JSON collection.

> Note: Throughout this project, my CSS classes are all TailwindCSS utility classes. Styling isn't particularly important to this demonstration, but they should also be somewhat self-explanatory if you know how Tailwind works.

Let's start with the basic layout.

## The Basic Layout

There are obviously some important bits for the layout of a collections page. In this case we'll make a very simple template that gives us a little text to explain the collection and how many products are loaded, followed by a grid of those products, showing an image, the title, and the price.

Easy enough right?

```html
<div class="h-full bg-white text-black p-4 pb-24" 
	 x-data="productList()" 
	 x-init="fetchProducts()">
	<div class="w-max mx-auto">
		<div class="text-xl" 
			 x-text="title"></div>
		<div class="text-gray-500 text-sm" 
			 x-text="intro"></div>
		<div class="text-gray-500 text-sm">
			<span x-text="srcMessage">Searching Through:</span>
			<span x-text="displayProducts.length"></span>
			of 
			<span x-text="filteredProducts.length"></span>
			products
		</div>
	</div>

	<div class="w-full mx-auto grid grid-cols-2 gap-4  pt-8 px-0 | md:grid-cols-3 md:w-3/4">
	
		<template x-for="product in displayProducts" 
				  :key="product.id">
			<div class="bg-white w-full h-min rounded-xl card text-grey-darkest" 
				 x-transition:enter="transition duration-1000 transform ease-linear" 
				 x-transition:enter-start="opacity-0" 
				 x-show="show" 
				 :id="`listItem-${product.id}`">
				<img :id="`image-${product.id}`" 
					 class="w-full pt-0 px-0 mb-4 rounded-t-xl lazyload" 
					 src="loader.gif" 
					 x-bind:data-srcset="product.image"/>
				<div class="text-base text-gray-700 text-center font-bold my-4 w-full" 
					 x-text="product.title"></div>
				<div class="w-full px-4 mb-4 text-2xl text-center text-green-700" 
					 x-text="product.price"></div>
			</div>
		</template>

	</div>

	<div class="w-max mx-auto" 
		 x-show="showLoadMore">
		<button class="mx-auto px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 mt-8" 
				@click="extendList()" 
				x-text="buttonText">Loading...</button>
	</div>
  
</div> 
```

Of course, this doesn't include any of the functions for actually pulling the information, but this does give us the most basic of layouts.

Something like this after being loaded with products:

<img src="/img/alpine-based-collection-1.png" class="mx-auto w-full max-w-md"/>

Then after the list, we provide a button to show more products, as we don't simply want an endless list right out of the gate. 

We'll get into how these component work in more detail, but first we need to fill this with some more logic.

## The Logic


```js
function productList() {
  return {
    title: 'Product List',
    intro: 'Here\'s our Product List',
    limit: 36,
    currentPage: 0,
    nextPage: 1,
	products: [],
	show:true,
	showLoadMore: true,
    response: '',
	buttonText: 'Loading...',
	fetchProducts() {
        this.currentPage = this.nextPage;
		this.srcMessage = 'Searching through:';
		this.buttonText = 'Loading...';
           fetch(`https://storename.myshopify.com/collections/all?view=json&page=${this.currentPage}`)
			   .then(response => response = response.json())
			   .then(data => {this.products = this.products.concat(data.products); this.response = data.products.length;})
			   .then(products => {this.recurseProducts(products)})
	},
	  get filteredProducts() {
       if (this.searchText === "") {
              return this.products;
            }
            return this.products.filter((product) => {
              return product.title.toLowerCase().includes(this.searchText.toLowerCase());
            });
	  },
	  get displayProducts() {
			return this.filteredProducts.slice(0,this.limit);
	  },
	  recurseProducts() {
      if (this.filteredProducts.length < 1000 && 
		  this.products.length < 1000 && 
		  this.response > 35) {
				this.nextPage++;
        this.fetchProducts();
      } 
		  else { this.srcMessage = 'Showing';
						 if (this.response < 36 && 
							 this.filteredProducts.length < this.limit) {
							 this.showLoadMore = false;
						 };
							this.buttonText = 'Show 36 More';
						};
    },
		extendList() {
			this.limit += 36;
			this.recurseProducts();
		},
  }
};
```

This is all the necessary logic for this to work, plus a little extra bits to allow for a quick and basic search feature.

This is probably all kind of messed up; I have talked before about how I am not a web developer. But it is functional.

But let's break it down.

## The Breakdown
Naturally, this whole thing is a single function loading these variables and functions into alpineJS for use throughout our document.

It starts very simple:

```js
return {
    title: 'Product List', // {{ collection.title }}
    intro: 'Here\'s our Product List', //{{ collection.description }} 
    limit: 36, //how many items to display in the list
    currentPage: 0, //the page being loaded/most recently loaded
    nextPage: 1, //page to load if moving to later pages
	products: [], //array to hold our collection.json data
	show:true, //boolean used to only show certain dom elements after alpine initializes
	showLoadMore: true,
    response: '', //length of most recent fetch, to ensure we don't keep fetching after there are no more products
	buttonText: 'Loading...'
```

This is, of course, just setting up our starting information before anything else. On a real store, I'd have it pumping the first page of results directly into this function from the get go to decrease the time to get products on the page.

```js
fetchProducts() {
        this.currentPage = this.nextPage;
		this.srcMessage = 'Searching through:';
		this.buttonText = 'Loading...';
           fetch(`https://storename.myshopify.com/collections/all?view=json&page=${this.currentPage}`)
			   .then(response => response = response.json())
			   .then(data => {this.products = this.products.concat(data.products); this.response = data.products.length;})
			   .then(products => {this.recurseProducts(products)})
	},
```

This is out main fetching function to collect more product information.

Of course, it's important to know that the fetch request is towards our custom collection.json template on Shopify that we discussed before, not a default Shopify API.

I used two variables for controlling the next page to load so that this could be easily adapted to both load forwards and backwards (for example, if a user clicked on a later product, and we want that product to load quickly when returning to the collection page) to fill up the information.

So for moving forward or backwards, we could set the current page to next or previous before running the fetch. This would allow us to easily keep track of which additional products should be loaded in either direction.

After the fetch, I naturally toss the new products into the products array, log how long that response was and trigger the `recurseProducts` function. Let's jump ahead to take a look at that.

```js
recurseProducts() {
      if (this.filteredProducts.length < 1000 && 
		  this.products.length < 1000 && 
		  this.response > 35) {
				this.nextPage++;
        this.fetchProducts();
      } 
		  else { this.srcMessage = 'Showing';
						 if (this.response < 36 && 
							 this.filteredProducts.length < this.limit) {
							 this.showLoadMore = false;
						 };
							this.buttonText = 'Show 36 More';
						};
    },
```

This function is used primarily to set the parameters for deciding whether more products need to be fetched or not. I went through multiple phases with this, regarding whether to have products only load as needed, or to load them all progressively at page load, so this should have the structure in place to switch between them, while not necessarily being maximized for either. Which of these makes more sense for any store likely depends on how long the product list is and how often users use filters and other such that could make a big list small. If users progress through it normally, then simply loaded products as needed would likely be very effective.

This basically checks the conditions that would require fetching another page of products, and if that fails it checks whether the 'Load More' button should show or not and gives it a proper label, which is normally changed to "loading" if products are loading.

```js
get filteredProducts() {
       if (this.searchText === "") {
              return this.products;
            }
            return this.products.filter((product) => {
              return product.title.toLowerCase().includes(this.searchText.toLowerCase());
            });
	  },
	  get displayProducts() {
			return this.filteredProducts.slice(0,this.limit);
	  },
```

As I'm sure you can guess, these functions define which products to actually display on the page.

I feel having this split into 2 separate arrays based on your master product array is beneficial for this implementation, allowing you to use one that handles your filters and the other that handles limiting the number to show.

My logic there could be off, but I feel keeping those actions separate in the functions is more maintainable and useful than smashing them together.