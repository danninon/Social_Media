
class Main extends React.Component {
	constructor(props) {
		super(props);
		const accessToken = new URLSearchParams(window.location.search).get('accessToken');
		this.state = {
			accessToken: accessToken,
			loggedUser: ""
		};
		if (sessionStorage.getItem("accessToken") === null) {
			if (accessToken !== null) {
				sessionStorage.setItem("accessToken", accessToken);
			} else {
				//handleError
			}
		}
		// let data = sessionStorage.getItem('key');
		// sessionStorage.removeItem('key');
		// sessionStorage.clear();
	}
	render() {
		return React.createElement(
			"div",
			{ className: "main-block" },
			React.createElement(ToolBar, { className: "ToolBar" }),
			React.createElement(PostsListBox, null)
		);
	}
	componentWillUnmount() {
		//sessionStorage.clear();
	}

	async componentDidMount() {

		// console.log("2");


	}
};

class ToolBar extends React.Component {

	constructor(props) {
		super(props);
		this.handle_redirect_admin = this.handle_redirect_admin.bind(this);
		this.state = {};
		this.listen_on_new_posts_or_messages = this.listen_on_new_posts_or_messages.bind(this);
		this.listen_on_new_posts_or_messages();
	}

	//initial fetch
	async componentDidMount() { }

	//when fetch send authenticate!


	//should filter by time


	render() {
		return React.createElement(
			'div',
			{ className: 'ToolBar' },
			React.createElement(
				'button',
				{ className: (this.user_id == "0") ? "button" : "transparent container", onClick: this.handle_redirect_admin },
				'Admin Page'
			),
			React.createElement(
				'button',
				{ className: 'button', onClick: this.handle_redirect_home },
				'Home Page'
			),
			React.createElement(
				'button',
				{ className: 'button', onClick: this.handle_redirect_chat },
				'Message Page'
			),
			React.createElement(
				'button',
				{ className: 'button', onClick: this.handle_redirect_about },
				'About Page'
			),
			React.createElement(
				'button',
				{ className: 'button', onClick: this.handle_redirect_login },
				'Logout'
			),
			React.createElement(
				'button',
				{ className: 'newbutton', onClick: this.handle_redirect_home },
				'New Posts'
			),
			React.createElement(
				'button',
				{ className: 'newbutton', onClick: this.handle_redirect_chat },
				'New Message'
			)
		);
	}

	handle_redirect_admin() {
		//if it is an admin allow this otherwise, show an error
		window.location.href = '/admin/admin.html';
	}
	handle_redirect_home() {
		//if not home already
		window.location.href = '/main/main.html';
	}

	handle_redirect_about() {
		//if not at about already
		window.location.href = '/about/about.html';
	}
	handle_redirect_chat() {
		//if not at chat already
		window.location.href = '/chat/chat.html';
	}

	handle_redirect_login() {
		sessionStorage.removeItem('accessToken');
		window.location.href = '/login/login.html';
	}

	async fetch_posts() {
		const response = await fetch('/api/users/post/all', {
			headers: { 'Authorization': 'BEARER ' + sessionStorage.getItem('accessToken') }
		});
		if (response.status == 200) {
			const data = await response.json();
			return data;
		} else if (response.status == 403) {
			sessionStorage.removeItem('accessToken');
			window.location.href = '/login/login.html';
		} else {
			const err = await response.text();
			alert(err);
		}
	}

	async fetch_messages() {
		const response = await fetch('/api/users/message/all', {
			headers: { 'Authorization': 'BEARER ' + sessionStorage.getItem('accessToken') }
		});
		if (response.status == 200) {
			const data = await response.json();
			return data;
		} else if (response.status == 403) {
			sessionStorage.removeItem('accessToken');
			window.location.href = '/login/login.html';
		} else {
			const err = await response.text();
			alert(err);
		}
	}

	async get_user_id() {
		const response = await fetch('/api/users/getId', {
			headers: { 'Authorization': 'BEARER ' + sessionStorage.getItem('accessToken') }
		});
		if (response.status == 200) {
			const data = await response.json();
			return data;
		} else if (response.status == 403) {
			sessionStorage.removeItem('accessToken');
			window.location.href = '/login/login.html';
		} else {
			const err = await response.text();
			alert(err);
		}
	}

	async listen_on_new_posts_or_messages() {
		console.log(this);
		this.posts_number = (await this.fetch_posts()).length;
		this.messages_number = (await this.fetch_messages()).length;
		this.user_id = await this.get_user_id();
		console.log(this.posts_number, this.messages_number, this.user_id);
		var admin = document.querySelector("button.transparent");
		admin.className = (this.user_id == "0") ? "button" : "transparent container"
		var el = document.querySelectorAll("button.newbutton");
		console.log(el, "button");

		setInterval(async () => {
			console.log(el, "button");

			const messagesNumber = (await this.fetch_messages()).length;
			if (messagesNumber > this.messages_number) {
				el[1].style.backgroundColor = "red";
			}
			const posts = await this.fetch_posts();
			let postsNumber = posts.length;
			while (postsNumber > this.posts_number) {
				postsNumber--;
				if (posts[postsNumber].author.id != this.user_id) {
					el[0].style.backgroundColor = "red";
				}
			}
		}, 30000);
	}

}

class PostItem extends React.Component {
	constructor(props) {
		super(props);
		this.handle_click = this.handle_click.bind(this);
		this.state = { postAutherName: '', postText: '', postTime: '' };
	}

	handle_click() {
		if (this.props.set_selected) this.props.set_selected(this.props.id);
	}

	render() {
		return React.createElement(
			'div',
			{ className: 'PostItem ' },
			React.createElement(
				'div',
				{ className: 'container' },
				React.createElement(
					'label',
					null,
					React.createElement(
						'strong',
						null,
						'Author:'
					)
				),
				React.createElement(
					'label',
					{ className: 'PostAuthorName' },
					this.props.post.author.name
				)
			),
			React.createElement(
				'div',
				{ className: 'container' },
				React.createElement(
					'label',
					null,
					React.createElement(
						'strong',
						null,
						'Text:'
					)
				),
				React.createElement('textarea', { value: this.props.post.content.text, disabled: true, className: 'postText' })
			),
			React.createElement(
				'div',
				{ className: 'container' },
				React.createElement(
					'label',
					null,
					React.createElement(
						'strong',
						null,
						'Time:'
					)
				),
				React.createElement(
					'label',
					{ className: 'postTime' },
					this.props.post.content.date
				)
			),
			React.createElement('hr', null)
		);
	}
}

//insert add button
class PostsListBox extends React.Component {

	constructor(props) {
		super(props);

		this.handle_post_input_box = this.handle_post_input_box.bind(this);
		this.handle_post_submit = this.handle_post_submit.bind(this);

		this.state = { posts: [], postText: "" };
	}

	async get_user_id() {
		const response = await fetch('/api/users/getId', {
			headers: { 'Authorization': 'BEARER ' + sessionStorage.getItem('accessToken') }
		});
		if (response.status == 200) {
			const data = await response.json();
			return data;
		} else if (response.status == 403) {
			sessionStorage.removeItem('accessToken');
			window.location.href = '/login/login.html';
		}
		else {
			const err = await response.text();
			alert(err);
		}
	}

	//initial fetch
	async componentDidMount() {
		this.user_id = await this.get_user_id();
		let posts = (await this.fetch_posts()).reverse();
		console.log({ posts });
		let myfirstPost = posts.find(post => post.author.id === this.user_id);
		console.log({ myfirstPost });

		const viewsPost = [];
		if (myfirstPost) {
			viewsPost.push(myfirstPost);
		} else if (posts.length > 0) {
			viewsPost.push(posts.shift());
		}
		for (let i = 0; i < 4; i++) {
			if (myfirstPost && myfirstPost.content.id === posts[0].content.id) {
				posts.shift();
			}
			if (posts.length > 0) {
				viewsPost.push(posts.shift());
			}
		}
		console.log({ viewsPost });

		this.update_post_list(viewsPost);
	}

	//when fetch send authenticate!


	//should filter by time


	render() {
		return React.createElement(
			'div',
			{ className: 'container' },
			React.createElement(
				'div',
				{ className: 'container' },
				React.createElement(
					'h2',
					null,
					' Submit Post: '
				),
				React.createElement(
					'div',
					null,
					React.createElement('textarea', {
						type: 'name',
						name: 'postText',
						placeholder: 'write post here: when finished, press the submit button to upload the post.',
						value: this.state.postText,
						onChange: this.handle_post_input_box,
						required: true
					}),
					React.createElement(
						'button',
						{
							className: 'button',
							type: 'submit',
							name: 'Submit',
							onClick: this.handle_post_submit
						},
						'Post'
					)
				)
			),
			React.createElement(
				'h2',
				null,
				' Recent Posts: '
			),
			React.createElement(
				'div',
				{ className: 'left_container' },
				this.state.posts.map((item, index) => {
					return React.createElement(PostItem, { post: item, key: index });
				})
			)
		);
		//add posts.sort(predicate(date))
		//map only 10 posts from server
	}

	update_post_list(updated_posts) {

		this.setState({ posts: updated_posts });
	}

	async fetch_posts() {
		const response = await fetch('/api/users/post/all', {
			headers: { 'Authorization': 'BEARER ' + sessionStorage.getItem('accessToken') }
		});
		if (response.status == 200) {
			const data = await response.json();
			return data;
		} else if (response.status == 403) {
			sessionStorage.removeItem('accessToken');
			window.location.href = '/login/login.html';
		} else {
			const err = await response.text();
			alert(err);
		}
	}

	async handle_post_submit() {
		const response = await fetch('/api/users/post', {
			method: 'POST',
			body: JSON.stringify({ postText: this.state.postText }),
			headers: {
				'Authorization': 'BEARER ' + sessionStorage.getItem('accessToken'),
				'Content-Type': 'application/json'
			}

		});

		if (response.status == 200) {
			window.location.href = '/main/main.html';
			//const postItem = await response.json();
			//const res =  this.update_post_list(postItem);	
			//alert ("Success! Res: " + res)	  ;
		} else if (response.status == 403) {
			sessionStorage.removeItem('accessToken');
			window.location.href = '/login/login.html';
		} else {
			const err = await response.text();
			alert(err);
		}
	}
	async handle_post_input_box(event) {
		this.setState({ [event.target.name]: event.target.value });
	}

};

