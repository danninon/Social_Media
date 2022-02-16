
class Main extends React.Component {
  constructor(props) {
    super(props);
    const accessToken = new URLSearchParams(window.location.search).get('accessToken');
    this.state = {
      accessToken: accessToken,
      loggedUser: ""
    };
    if (!sessionStorage.getItem(accessToken)) {
      sessionStorage.setItem("accessToken", this.state.accessToken);
    }
    // let data = sessionStorage.getItem('key');
    // sessionStorage.removeItem('key');
    // sessionStorage.clear();
  }
  render() {
    return React.createElement(
      "div",
      null,
      React.createElement(PostsListBox, { classname: "PostListBox", name: "Posts" })
    );
  }
  componentWillUnmount() {
    // sessionStorage.clear();
  }

  async componentDidMount() {

    console.log("2");
    window.alert("2");
  }
};

class PostItem extends React.Component {
	constructor(props) {
		super(props);
		this.handle_click = this.handle_click.bind(this);
		this.state = { authorName: '', PostName: '', PostText: '', PostTime: '' };
	}

	handle_click() {
		if (this.props.set_selected) this.props.set_selected(this.props.id);
	}

	render() {
		return React.createElement(
			'div',
			{ className: 'PostItem ' },
			React.createElement(
				'li',
				{ className: 'PostAuthorName' },
				this.props.post.authorName
			),
			React.createElement(
				'li',
				{ className: 'PostName' },
				this.props.post.PostName
			),
			React.createElement(
				'li',
				{ className: 'PostText' },
				this.props.post.PostText
			),
			React.createElement(
				'li',
				{ className: 'PostTime' },
				this.props.post.PostTime
			)
		);
	}
}

class PostsListBox extends React.Component {

	constructor(props) {
		super(props);

		this.handle_post_input_box = this.handle_post_input_box.bind(this);
		this.handle_post_submit = this.handle_post_submit.bind(this);

		this.state = { posts: [], PostText: "" };
	}

	//initial fetch
	async componentDidMount() {
		const posts = await this.fetch_posts();
		this.update_post_list(posts);
	}

	//when fetch send authenticate!
	async fetch_posts() {
		const response = await fetch('/api/users/post/all', {
			headers: new Headers({ 'Authorization': 'BEARER ' + sessionStorage.getItem('accessToken') })
		});
		if (response.status != 200) {
			throw new error('Error while fetching posts');
		}
		const data = await response.json();
		return data;
	}

	//should filter by time
	update_post_list(newPosts) {
		this.setState({ posts: newPosts });
	}

	render() {
		return React.createElement(
			'div',
			{ className: 'PostsListBox' },
			React.createElement(
				'div',
				null,
				'Post:',
				React.createElement('input', {
					type: 'name',
					name: 'PostText',
					placeholder: 'PostText',
					value: this.state.PostText,
					onChange: this.handle_post_input_box,
					required: true
				}),
				React.createElement(
					'button',
					{ className: 'SubmitButton',
						name: 'Submit',
						onClick: this.handle_post_submit },
					'Submit Post'
				)
			),
			this.state.posts.map((item, index) => {
				return React.createElement(PostItem, { post: item, key: index });
			})
		);
	}

	async handle_post_submit() {
		let posts;
		const response = await fetch('/api/users/post', {
			method: 'POST',
			body: JSON.stringify({ PostText: this.state.PostText, PostName: "POST_NAME_SAMPLE", PostTime: Date.now() }),
			headers: {
				'Authorization': 'BEARER ' + sessionStorage.getItem('accessToken'),
				'Content-Type': 'application/json' }

		});

		if (response.status == 200) {
			const res = await this.update_post_list(response.body.post);
		} else {
			const err = await response.text();
			alert(err);
		}
	}
	async handle_post_input_box(event) {
		this.setState({ [event.target.name]: event.target.value });
	}

};