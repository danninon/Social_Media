class ToolBar extends React.Component {

	constructor(props) {
		super(props);
		this.handle_redirect_admin = this.handle_redirect_admin.bind(this);
		
		this.listen_on_new_posts_or_messages = this.listen_on_new_posts_or_messages.bind(this);
		this.listen_on_new_posts_or_messages();
		 
	}

	//initial fetch
	async componentDidMount() {

	}

	//when fetch send authenticate!


	//should filter by time


	render() {
		return <div className='ToolBar'>
			<button className={(this.user_id == "0") ? "button" : "transparent container"} onClick={this.handle_redirect_admin}>Admin Page</button>
			<button className='button' onClick={this.handle_redirect_home}>Home Page</button>
			<button className='button' onClick={this.handle_redirect_chat}>Message Page</button>
			<button className='button' onClick={this.handle_redirect_about}>About Page</button>

			<button className='button' onClick={this.handle_redirect_login}>Logout</button>

			<button className='newbutton' onClick={this.handle_redirect_home}>New Posts</button>

			<button className='newbutton' onClick={this.handle_redirect_chat}>New Message</button>
		</div>
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
		sessionStorage.removeItem('accessToken')
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
		this.posts_number = (await this.fetch_posts()).length
		this.messages_number = (await this.fetch_messages()).length
		this.user_id = await this.get_user_id();
		console.log(this.posts_number, this.messages_number, this.user_id)
		var admin = document.querySelector("button.transparent");
		admin.className = (this.user_id == "0") ? "button" : "transparent container"
		var el = document.querySelectorAll("button.newbutton");
		console.log(el, "button")

		setInterval(async () => {
			console.log(el, "button")

			const messagesNumber = (await this.fetch_messages()).length
			if (messagesNumber > this.messages_number) {
				el[1].style.backgroundColor = "red"
			}
			const posts = await this.fetch_posts();
			let postsNumber = posts.length;
			while (postsNumber > this.posts_number) {
				postsNumber--;
				if (posts[postsNumber].author.id != this.user_id) {
					el[0].style.backgroundColor = "red"
				}
			}
		}, 30000)
	}

}