const DELETED = 'deleted';
const ACTIVE = 'active';
const CREATED = 'created';
const SUSPENDED = 'suspended';
class Admin extends React.Component {

    constructor(props) {
        super(props);
        this.state = { id: "", status: ACTIVE };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    //initial fetch
    async componentDidMount() {}

    //when fetch send authenticate!


    //should filter by time
    //adminOptions should be a different component
    render() {
        return React.createElement(
            'div',
            { className: 'main-block' },
            React.createElement(ToolBar, { className: 'ToolBar' }),
            React.createElement(
                'h1',
                null,
                'Admin Options'
            ),
            React.createElement(
                'form',
                { className: 'container', onSubmit: this.handleSubmit },
                React.createElement(
                    'h2',
                    null,
                    'Send Global Message'
                ),
                React.createElement(
                    'div',
                    null,
                    React.createElement(
                        'label',
                        { htmlFor: 'id' },
                        React.createElement(
                            'strong',
                            null,
                            'UserId:'
                        )
                    ),
                    React.createElement('input', {
                        type: 'id',
                        name: 'id',
                        placeholder: 'id',
                        value: this.state.id,
                        onChange: this.handleChange,
                        required: true
                    }),
                    React.createElement(
                        'button',
                        { type: 'submit', className: 'button' },
                        'Change Status'
                    )
                ),
               
                React.createElement(
                    'h2',
                    null,
                    'Change User Status'
                ),
                React.createElement(
                    'div',
                    null,
                    React.createElement(
                        'h3',
                        null,
                        'New status:'
                    ),
                    React.createElement(
                        'select',
                        { name: 'status', id: 'statusSelect', required: true, value: this.state.status, onChange: this.handleChange },
                        React.createElement(
                            'option',
                            { value: 'active' },
                            'Active'
                        ),
                        React.createElement(
                            'option',
                            { value: 'suspended' },
                            'Suspended'
                        ),
                        React.createElement(
                            'option',
                            { value: 'deleted' },
                            'Deleted'
                        )
                    )
                )
            ),
            React.createElement(MessageListBox, { className: 'container' })
        );
    }

    // /approveUser
    // /suspend/:id
    // /unsuspend/:id
    // /deleteUser/:id


    async handleSubmit(event) {

        try {
            let err;
            let fetch_url = '/api/admin';
            let body = { id: this.state.id, status: this.state.status };
            let method;
            let headers = {
                'Authorization': 'BEARER ' + sessionStorage.getItem('accessToken'),
                'Content-Type': 'application/json' };

            switch (this.state.status) {
                case ACTIVE:
                    fetch_url += '/approveUser';
                    method = 'POST';
                    break;
                case SUSPENDED:
                    fetch_url = fetch_url + '/suspend/' + this.state.id;
                    method = 'PUT';

                    break;
                case DELETED:
                    fetch_url = fetch_url + '/deleteUser/' + this.state.id;
                    method = 'DELETE';
                    break;
                default:
                    throw new error(this.state.status + " is not an option");
                    break;
            }
            const response = await fetch(fetch_url, { method: method,
                body: JSON.stringify(body),
                headers: headers });

            if (response.status == 200) {
                window.alert("action successful\nUser status: " + (await response));
            } else {
                throw new error(response.text());
            }
        } catch (e) {
            window.alert(e.text);
        }
    }

    async handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }
}

class ToolBar extends React.Component {

	constructor(props) {
		super(props);
		this.handle_redirect_admin = this.handle_redirect_admin.bind(this);
		this.state = {};
	}

	//initial fetch
	async componentDidMount() {}

	//when fetch send authenticate!


	//should filter by time


	render() {
		return React.createElement(
			'div',
			{ className: 'ToolBar' },
			React.createElement(
				'button',
				{ className: 'button', onClick: this.handle_redirect_admin },
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
				{ className: 'newbutton', onClick: this.handle_redirect_chat },
				'New Posts'
			),
			React.createElement(
				'button',
				{ className: 'newbutton', onClick: this.handle_redirect_about },
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

class MessageItem extends React.Component {
	constructor(props) {
		super(props);
		//this.handle_click = this.handle_click.bind( this );
		//this.state = { messageAuthorName: '', messageText: '', messageTime: '' };
	}

	render() {
		return React.createElement(
			'div',
			{ className: 'MessageItem container ' },
			React.createElement(
				'div',
				null,
				React.createElement(
					'label',
					null,
					React.createElement(
						'strong',
						null,
						'From:'
					)
				),
				React.createElement(
					'label',
					{ className: 'messageAuthorName' },
					this.props.message.from.name
				)
			),
			React.createElement(
				'div',
				null,
				React.createElement(
					'label',
					null,
					React.createElement(
						'strong',
						null,
						'Text:'
					)
				),
				React.createElement('textarea', { value: this.props.message.text, disabled: true, className: 'messageText' })
			),
			React.createElement(
				'div',
				null,
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
					{ className: 'messageTime' },
					this.props.message.date
				)
			)
		);
	}
}

//insert add button
class MessageListBox extends React.Component {

	constructor(props) {
		super(props);

		this.hande_message_input_box = this.hande_message_input_box.bind(this);
		this.handle_message_submit = this.handle_message_submit.bind(this);
		this.state = { messages: [], messageText: "" };
	}

	//initial fetch
	async componentDidMount() {
		const messages = await this.fetch_messages();
		this.update_message_list(messages);
	}

	//should filter by time


	render() {
		return React.createElement(
			'div',
			{ className: 'container' },
			React.createElement(
				'div',
				null,
				React.createElement('textarea', {
					type: 'name',
					name: 'messageText',
					placeholder: 'write message here: when finished, press the submit button to upload the message.',
					value: this.state.messageText,
					onChange: this.hande_message_input_box,
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
						onClick: this.handle_message_submit },
					'Send Global Message'
				)
			)
		);

		//add posts.sort(predicate(date))
		//map only 10 posts from server
	}

	update_message_list(updated_messages) {
		this.setState({ messages: updated_messages });
	}

	async fetch_messages() {
		const response = await fetch('/api/users/message/all', {
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

	async handle_message_submit() {
		const response = await fetch('/api/admin/sendMessageToAllUsers', {
			method: 'POST',
			body: JSON.stringify({ messageText: this.state.messageText }),
			headers: {
				'Authorization': 'BEARER ' + sessionStorage.getItem('accessToken'),
				'Content-Type': 'application/json' }

		});

		if (response.status == 200) {
			this.update_message_list((await this.fetch_messages()));
			//const postItem = await response.json();
			//const res =  this.update_message_list(postItem);	
			//alert ("Success! Res: " + res)	  ;
		} else {
			const err = await response.text();
			alert(err);
		}
	}
	async hande_message_input_box(event) {
		this.setState({ [event.target.name]: event.target.value });
	}

};