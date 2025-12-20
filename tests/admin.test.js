import assert from 'assert';
import * as adminCtrl from '../controllers/admin.controller.js';
import User from '../models/user.model.js';
import Post from '../models/post.model.js';

const makeRes = () => {
  const res = {};
  res.statusCode = 200;
  res.body = null;
  res.status = function (code) { this.statusCode = code; return this; };
  res.json = function (obj) { this.body = obj; return this; };
  return res;
};

const run = async () => {
  // Test getAllUsers (mock chainable query methods)
  const usersArray = [{ _id: 'u1', fullname: 'Alice', email: 'a@x' }];
  User.find = () => ({
    select: () => ({
      sort: async () => usersArray
    })
  });
  const res1 = makeRes();
  await adminCtrl.getAllUsers({}, res1);
  assert.strictEqual(res1.statusCode, 200);
  assert.strictEqual(res1.body.success, true);
  assert.strictEqual(res1.body.total, 1);

  // Test getAllPostsAdmin (mock chainable query methods)
  const postsArray = [ { _id: 'p1', title: 'Post', author: { _id: 'u1', username: 'alice' } } ];
  Post.find = () => ({
    populate: () => ({
      sort: async () => postsArray
    })
  });
  const res2 = makeRes();
  await adminCtrl.getAllPostsAdmin({}, res2);
  assert.strictEqual(res2.statusCode, 200);
  assert.strictEqual(res2.body.success, true);
  assert.strictEqual(res2.body.total, 1);

  // Test deleteUserByAdmin (user exists)
  User.findByIdAndDelete = async (id) => ({ _id: id, fullname: 'Bob' });
  Post.deleteMany = async (q) => ({ deletedCount: 2 });
  const req3 = { params: { id: 'u2' } };
  const res3 = makeRes();
  await adminCtrl.deleteUserByAdmin(req3, res3);
  assert.strictEqual(res3.statusCode, 200);
  assert.strictEqual(res3.body.success, true);

  // Test deleteUserByAdmin (user not found)
  User.findByIdAndDelete = async (id) => null;
  const req4 = { params: { id: 'notfound' } };
  const res4 = makeRes();
  await adminCtrl.deleteUserByAdmin(req4, res4);
  assert.strictEqual(res4.statusCode, 404);

  // Test deletePostByAdmin (post exists)
  Post.findByIdAndDelete = async (id) => ({ _id: id, title: 'X' });
  const req5 = { params: { id: 'p2' } };
  const res5 = makeRes();
  await adminCtrl.deletePostByAdmin(req5, res5);
  assert.strictEqual(res5.statusCode, 200);

  // Test deletePostByAdmin (not found)
  Post.findByIdAndDelete = async (id) => null;
  const req6 = { params: { id: 'no' } };
  const res6 = makeRes();
  await adminCtrl.deletePostByAdmin(req6, res6);
  assert.strictEqual(res6.statusCode, 404);

  console.log('All admin controller tests passed');
};

run().catch(err => { console.error('Tests failed:', err); process.exit(1); });
