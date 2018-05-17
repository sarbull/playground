import './index.less';

const PostService = function () {
  let self = this;

  self.retrieveAll = function () {
    return fetch('https://public-api.wordpress.com/rest/v1/sites/idcdistro.wordpress.com/posts/');
  };

  return {
    retrieveAll: self.retrieveAll
  };
};

const Post = function (post) {
  let self = this;
  self._post = {};

  self.setPost = function (post) {
    self._post.title = post.title;

    self._post.author = {
      first_name: post.author.first_name,
      last_name: post.author.last_name
    };

    self._post.content = post.content;

    self._post.date = new Date(Date.parse(post.date));

    self._post.URL = post.URL;
  };

  self.setPost(post);

  return {
    post: self._post
  };
};

const PostController = function () {
  let self = this;
  self.postService = new PostService();
  self.postView = new PostView();

  self.posts = [];
  self.renderedItems = 0;

  self.index = function (applicationContext) {
    return self.postService.retrieveAll().then(
      function (response) {
        if (response.status !== 200) {
          console.error('Status Code:', response.status);
          return;
        }

        response.json().then(function (data) {
          data.posts.forEach(function (post) {
            self.posts.push(new Post(post));
          });

          // render stuff
          self.posts.forEach((el, i) => {
            if (i < 10) {
              applicationContext.appendChild(self.postView.render(el.post));

              self.renderedItems++;
            }
          });

          // i couldn't find a way of paginating from the API so i did this
          window.onscroll = function (e) {
            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
              self.posts.forEach((el, i) => {
                if (i >= self.renderedItems) {
                  applicationContext.appendChild(self.postView.render(el.post));

                  self.renderedItems++;
                }
              });
            }
          };
        });
      }
    ).catch(function (err) {
      console.error('Fetch Error', err);
    });
  };

  return {
    index: self.index
  };
};

const PostView = function () {
  let self = this;

  self.postElement = function (post) {
    const template = `
      <div class="content">
        <h1>${post.title}</h1>
        
        ${post.content}
      </div>
  
      <div class="metadata">
        <div class="details">
          <span>by ${post.author.first_name} ${post.author.last_name}</span>
          <span>${post.date.toLocaleDateString()}</span>
        </div>
    
        <div class="links">
          <a href="${post.URL}">More details</a>
        </div>
      </div>
    `;

    const el = document.createElement('div');

    el.classList.add('post');

    el.innerHTML = template;

    return el;
  };

  return {
    render: self.postElement
  };
};

const ApplicationView = function () {
  let self = this;

  self.contentTemplate = function () {
    let content = document.createElement('div');
    content.id = 'wrapper';

    self.content = content;
  };

  self.contentTemplate();

  return {
    contentElement: self.content
  };
};

const Application = function () {
  let self = this;
  self.postController = new PostController();
  self.applicationView = new ApplicationView();

  self.init = function () {
    document.body.appendChild(self.applicationView.contentElement);

    self.start();
  };

  self.start = function () {
    self.postController.index(self.applicationView.contentElement);
  };

  self.init();
};

let app = new Application();