class ItemFormatter {
  static formatItems(user, data) {
    const itemCounts = {}; // To store counts of each item type

    data.forEach((item) => {
      if (item.type === 'c') {
        const itemName = `${item.name} (${item.color})`;
        if (!itemCounts[itemName]) {
          itemCounts[itemName] = 0;
        }
        itemCounts[itemName]++;
      } else {
        if (!itemCounts[item.name]) {
          itemCounts[item.name] = 0;
        }
        itemCounts[item.name]++;
      }
    });

    const formattedItems = Object.entries(itemCounts).map(([itemName, count]) => {
      return count > 1
        ? `${user} has ${itemName} x${count}`
        : `${user} has ${itemName}`;
    });

    return `${user}'s items on trade:\n${formattedItems.join('\n')}`;
  }

  static formatPets(user, data) {
    const formattedItems = data.map((item) => {
      if (item.type === 'c') {
        return `${item.name} (${item.color}),`;
      } else {
        return item.name;
      }
    });

    return `${user}'s pets:\n${formattedItems.join('\n')}`;
  }

  static formatPetsWithCounts(user, data) {
    const petCounts = {}; // To store counts of each pet type

    data.forEach((item) => {
      if (item.type === 'p') {
        if (!petCounts[item.name]) {
          petCounts[item.name] = 0;
        }
        petCounts[item.name]++;
      }
    });

    const formattedPets = Object.entries(petCounts).map(([petName, count]) => {
      return count > 1
        ? `${user} has ${petName} x${count}`
        : `${user} has ${petName}`;
    });

    return `${user}'s pets:\n${formattedPets.join('\n')}`;
  }

  static formatItemsList(user, data) {
    const itemCounts = {}; // To store counts of each item type

    data.forEach((item) => {
      if (item.type === 'c') {
        const itemName = `${item.name} (${item.color})`;
        if (!itemCounts[itemName]) {
          itemCounts[itemName] = 0;
        }
        itemCounts[itemName]++;
      } else {
        if (!itemCounts[item.name]) {
          itemCounts[item.name] = 0;
        }
        itemCounts[item.name]++;
      }
    });

    const formattedItems = Object.entries(itemCounts).map(([itemName, count]) => {
      return count > 1
        ? `${user} has ${itemName} x${count}`
        : `${user} has ${itemName}`;
    });

    return `${user}'s items on avatar:\n${formattedItems.join('\n')}`;
  }
}

module.exports = ItemFormatter;
module.exports = ItemFormatter;