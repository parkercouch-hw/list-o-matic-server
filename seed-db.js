const db = require('./models');

// NanoId -- with bad word filter
const en = require("nanoid-good/locale/en");
const nanoid = require("nanoid-good")(en);

async function addData() {
  try {
    const creator = await db.User.create({
      name: 'User 1',
      email: 'user1@email.com',
      password: 'password',
    });

    const otherUser = await db.User.create({
      name: 'User 2',
      email: 'user2@email.com',
      password: 'password',
    });

    const shoppingListKey = await nanoid();
    const otherListKey = await nanoid();

    const shoppingList = await db.List.create({
      name: 'Shopping List',
      creatorId: creator._id,
      key: shoppingListKey,
      items: [
        {
          content: 'Toilet paper',
          posterId: creator._id,
          completed: true,
        },
        {
          content: 'Ice cream',
          posterId: otherUser._id,
          completed: false,
        },
      ],
    });

    const otherList = await db.List.create({
      name: 'Other List',
      creatorId: otherUser._id,
      key: otherListKey,
      items: [
        {
          content: 'This is something',
          posterId: creator._id,
          completed: false,
        },
        {
          content: 'Something else',
          posterId: otherUser._id,
          completed: true,
        },
      ],
    });

    await db.User.findByIdAndUpdate(creator._id, {
      lists: [shoppingList._id],
    });

    await db.User.findByIdAndUpdate(otherUser._id, {
      lists: [shoppingList._id],
    });

    await db.User.findByIdAndUpdate(creator._id, {
      lists: [otherList._id],
    });

    await db.User.findByIdAndUpdate(otherUser._id, {
      lists: [otherList._id],
    });

    console.log('Added!');
    
  } catch (error) {
    console.log('DB ERROR: ', error);
  }
}

addData();
