const data = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");
const { arrayCommentData, retrieveUserNames } = require("../utilFunctions");
const db = require("../db/connection");

beforeEach(() => seed(data));
afterAll(() => db.end());

describe("arrayCommentData", () => {
  test("should take an object and return an array", () => {
    const input = {};
    const output = [];
    expect(arrayCommentData(input)).toEqual(output);
  });
  test("should not mutate input object", () => {
    const input = { data: 1, data2: 2 };
    const originalDataCopy = { ...input };
    arrayCommentData(input);
    expect(input).toEqual(originalDataCopy);
  });
  test("should take an object with 2 key value pairs and return it in an array with the correct data format ", () => {
    const input = { username: "testUser", body: "testBody" };
    const output = ["testUser", "testBody"];
    expect(arrayCommentData(input, "username", "body")).toEqual(output);
  });
  test("should return an empty array if the input object has less than 2 Key/Value pairs", () => {
    const input = { username: "testUser" };
    const output = [];
    expect(arrayCommentData(input)).toEqual(output);
  });
  test("should return an empty array if the input object has more than 2 Key/Value pairs", () => {
    const input = {
      username: "testUser",
      body: "testBody",
      extraData: "extraData",
    };
    const output = [];
    expect(arrayCommentData(input)).toEqual(output);
  });
});

describe("retrieveUserNames", () => {
  test("should take an array and return an array", () => {
    const input = [];
    const output = [];
    expect(retrieveUserNames(input)).toEqual(output);
  });
  test("should not mutate the original array", () => {
    const input = [{ username: "testUser" }];
    const output = [...input];
    retrieveUserNames(input);
    expect(input).toEqual(output);
  });
  test("should return the username when passed an array containing 1 object", () => {
    const input = [
      {
        username: "butter_bridge",
        name: "jonny",
        avatar_url:
          "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
      }
    ];
    const output = ["butter_bridge"]
    expect(retrieveUserNames(input, 'username')).toEqual(output)
  });
  test('should return multiple user names when passed multiple objects inside an array', () => {
    const input = [{
      username: 'butter_bridge',
      name: 'jonny',
      avatar_url:
        'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg'
    },
    {
      username: 'icellusedkars',
      name: 'sam',
      avatar_url: 'https://avatars2.githubusercontent.com/u/24604688?s=460&v=4'
    }]
    const output = ['butter_bridge', 'icellusedkars']
    expect(retrieveUserNames(input, 'username')).toEqual(output)
  });
});
