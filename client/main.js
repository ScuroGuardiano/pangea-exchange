const CENA_BRYLKI = 500 * 1000 * 1000;

window.onload = main;

async function main() {
    /** @type {{[key: string]: IItem}} */
    const itemData = await (await fetch("/api/optimized")).json();
    
    const targetDisplayElement = document.body;

    displayUlepy(itemData, targetDisplayElement);
}

function findItemsBelongsToGroup(group, itemData) {
    const found = {};

    for (let [groupKey, groupItems] of Object.entries(group)) {
        found[groupKey] = {};
        groupItems.forEach(itemName => {
            if (itemData[itemName]) {
                found[groupKey][itemName] = itemData[itemName];
            }
        });
    }
    return found;
}

// I am losing sanity, sorry for that, copied from stack overflow ^^
function roundToOneDecimalPlace(num) {
    return Math.round((num + Number.EPSILON) * 10) / 10;
}
/** 
 * Will convert item to price in bryłka per 100 with accuracy to 2 decimal places
 * @param {IItem} item 
 * */
function convertPricesToBPer100(item) {
    item.mostPopularPrice = item.mostPopularPrice / CENA_BRYLKI; //price per 1 item
    item.mostPopularPrice = roundToOneDecimalPlace(item.mostPopularPrice * 100); //price per 100 items

    item.mostPopularPriceAvg = item.mostPopularPriceAvg / CENA_BRYLKI;
    item.mostPopularPriceAvg = roundToOneDecimalPlace(item.mostPopularPriceAvg * 100);

    item.todaysMostPopularPrice = item.todaysMostPopularPrice / CENA_BRYLKI;
    item.todaysMostPopularPrice = roundToOneDecimalPlace(item.todaysMostPopularPrice * 100);
}

// I must visit a doctor
function itemGroupListFuckingIdkWhatToCategory(title, fuckingidk, displayStyle = "yang") {
    const category = new Category(title);
    for(let [subgroupKey, subgroupVal] of Object.entries(fuckingidk)) {
        const subcategory = new Subcategory(subgroupKey);
        category.addSubcategory(subcategory);

        for(let [itemName, item] of Object.entries(subgroupVal)) {
            const itemRenderObj = new Item(itemName, item, displayStyle);
            subcategory.addItem(itemRenderObj);
        }
    }
    return category;
}
function sortSubcategories(category, groupsOrder) {
    const sorted = [];
    groupsOrder.forEach(g => {
        sorted.push(category.subcategories.find(v => v.title === g));
    });
    category.subcategories = sorted;
}

/** @param {{[key: string]: IItem}} itemData*/
function displayUlepy(itemData, renderTarget) {
    /** @type {{[key: string]: {[key: string]: IItem}}} */
    const ulepy = findItemsBelongsToGroup(ITEM_GROUPS.Ulepy, itemData);
    
    Object.values(ulepy).forEach(subgroup => {
        Object.values(subgroup).forEach(item => {
            convertPricesToBPer100(item);
        });
    });
    
    const groupRenderObject = itemGroupListFuckingIdkWhatToCategory("Ulepy", ulepy, "b/100 szt.");
    sortSubcategories(groupRenderObject,
        [
            "1-100",
            "100-150",
            "150-200",
            "200-250",
            "251-253",
            "254",
            "Other"
        ]);
    renderTarget.appendChild(groupRenderObject.toHTMLElement());
}