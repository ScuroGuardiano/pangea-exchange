/**
 * @typedef {
     {
         totalSold: number;
         mostPopularPrice: number;
         soldForMostPopularPrices: number;
         mostPopularPriceAvg: number;
         todaysMostPopularPrice: number;
         soldTodayForMostPopularPrice: number;
         soldToday: number;
     }
 } IItem
*/

class Item {
    /**
     * @param {string} name 
     * @param {IItem} itemData 
     * @param {string} displayStyle
     * price will be render as this: Price: ${amount} ${displayStyle}
     */
    constructor(name, itemData, displayStyle = "yang") {
        this.name = name;
        this.data = itemData;
        this.displayStyle = displayStyle;
    }
    toHTMLElement() {
        const li = document.createElement("li");

        const h3 = document.createElement("h3");
        h3.textContent = this.name;
        li.appendChild(h3);

        const avgSpan = document.createElement("span");
        avgSpan.innerHTML = 
            `Średnia cena: ${this.data.mostPopularPriceAvg}${this.displayStyle}<br>`;
        li.appendChild(avgSpan);

        const mostPopularSpan = document.createElement("span");
        mostPopularSpan.innerHTML = 
            `Najpopularniejsza: ${this.data.mostPopularPrice}${this.displayStyle}<br>`;
        li.appendChild(mostPopularSpan);

        const todaysMostPopularSpan = document.createElement("span");
        todaysMostPopularSpan.innerHTML = 
            `Najpop. dzisiaj: ${this.data.todaysMostPopularPrice}${this.displayStyle}`;
        li.appendChild(todaysMostPopularSpan);

        return li;
    }
}

class Subcategory {
    /** @param {string} title */
    constructor(title) {
        this.title = title;
        /** @type { Array<Item> }*/
        this.items = [];
    }
    /**
     * @param {Item} item 
     */
    addItem(item) {
        this.items.push(item);
    }
    toHTMLElement() {
        const container = document.createElement("div");
        container.classList.add("subcategory");

        const header = document.createElement("header");
        const h2 = document.createElement("h2");
        h2.textContent = this.title;
        header.appendChild(h2);
        container.appendChild(header);

        const ul = document.createElement("ul");
        this.items.forEach(item => {
            ul.appendChild(item.toHTMLElement());
        });
        container.appendChild(ul);
        
        return container;
    }
}

class Category {
    /** @param {string} title */
    constructor(title) {
        this.title = title;
        /** @type {Array<Subcategory>} */
        this.subcategories = [];
    }
    /**
     * @param {Subcategory} subcategory 
     */
    addSubcategory(subcategory) {
        this.subcategories.push(subcategory);
    }
    toHTMLElement() {
        const container = document.createElement("div");
        container.classList.add("category");

        const header = document.createElement("header");
        const h1 = document.createElement("h1");
        h1.textContent = this.title;
        header.appendChild(h1);
        container.appendChild(header);

        this.subcategories.forEach(subcat => {
            container.appendChild(subcat.toHTMLElement());
        });

        return container;
    }
}
