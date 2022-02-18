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
				'form',
				{ className: 'formcontainer' },
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
				)
			)
		);
	}
}

//insert add button
export default class PostsListBox extends React.Component {

	constructor(props) {
		super(props);

		this.handle_post_input_box = this.handle_post_input_box.bind(this);
		this.handle_post_submit = this.handle_post_submit.bind(this);

		this.state = { posts: [], postText: "" };
	}

	//initial fetch
	async componentDidMount() {
		const posts = await this.fetch_posts();
		this.update_post_list(posts);
	}

	//when fetch send authenticate!


	//should filter by time


	render() {
		return React.createElement(
			'div',
			{ className: 'main-block' },
			React.createElement(
				'div',
				{ className: 'container' },
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
					})
				),
				React.createElement(
					'div',
					null,
					React.createElement(
						'button',
						{ className: 'button',
							type: 'submit',
							name: 'Submit',
							onClick: this.handle_post_submit },
						'Submit Post'
					)
				)
			),
			React.createElement(
				'div',
				null,
				' Recent Posts:',
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
				'Content-Type': 'application/json' }

		});

		if (response.status == 200) {
			this.update_post_list((await this.fetch_posts()));
			//const postItem = await response.json();
			//const res =  this.update_post_list(postItem);	
			//alert ("Success! Res: " + res)	  ;
		} else {
			const err = await response.text();
			alert(err);
		}
	}
	async handle_post_input_box(event) {
		this.setState({ [event.target.name]: event.target.value });
	}

};