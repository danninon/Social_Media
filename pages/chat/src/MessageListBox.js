class MessageItem extends React.Component 
{
	constructor(props) 
	{
		super(props);
		//this.handle_click = this.handle_click.bind( this );
		//this.state = { messageAuthorName: '', messageText: '', messageTime: '' };
	}
	
	render() {
		return <div className={ 'MessageItem '}>
					
						<div className='container'>
							<label ><strong>From:</strong></label>
							<label className='messageAuthorName'>{this.props.message.from.name}</label>
					    </div>


						<div className='container'>
							<label ><strong>Text:</strong></label>
							<textarea value={this.props.message.text} disabled={true} className='messageText'></textarea>
					    </div>

						<div className='container'>
							<label ><strong>Time:</strong></label>
							<label className='messageTime'>{this.props.message.date}</label>
					    </div>

			   </div>
	}
}

//insert add button
class MessageListBox extends React.Component 
{	

	constructor(props) 
	{
		super(props);
	
		this.hande_message_input_box = this.hande_message_input_box.bind(this);
		this.handle_message_submit = this.handle_message_submit.bind(this);
	    this.state = {messages: [], messageText: '', messageRecipientId: ''};
		
	}

    //initial fetch
    async componentDidMount() 
	{
		const messages = (await this.fetch_messages()).reverse();

		const view_messages = []
		for (let i = 0; i < 5; i++) {
			if (messages.length > 0) { view_messages.push(messages.shift()); }
		}
		this.update_message_list(view_messages);
	}

	//should filter by time


    render() {
		return <div className="formcontainer" >
		<div className="main-block">
			<div className="container"> 
			<h2>Message</h2>
				<textarea 
				type="name"
				name="messageText"
				placeholder="write message here: when finished, press the submit button to upload the message."
				value={this.state.messageText} 
				onChange={this.hande_message_input_box}
				required
				/>

				<hr></hr>
				
				<h2>Recipient</h2>
					<input 
					type="id"
					name="messageRecipientId"
					placeholder="write recipient's id here."
					value={this.state.messageRecipientId} 
					onChange={this.hande_message_input_box}
					required
				/>

				<button className = "button"
					type="submit" 
					name= "Submit"
					onClick = {this.handle_message_submit}>
					Send Message
				</button>
					<div>{this.state.messages.map( (item,index) => { return  <MessageItem  message={item}  key={index}/>  }  ) } </div>	
			</div>
		</div>
	</div>
}


	update_message_list( updated_messages )
	{
		this.setState( {messages : updated_messages} );
	}

    async fetch_messages() {
		const response = await fetch('/api/users/message/all', {
			headers: {'Authorization': 'BEARER ' + sessionStorage.getItem('accessToken')}
		});
		if (response.status == 200) {
			const data = await response.json();
			return data;
		} else {
			const err = await response.text();
			alert(err);
		}
	}

	async handle_message_submit(){
		const response = await fetch('/api/users/sendMessageToUser/', 
		{
			method: 'POST',
			body: JSON.stringify({messageText : this.state.messageText, messageRecipientId : this.state.messageRecipientId}),
			headers: { 
				'Authorization': 'BEARER ' + sessionStorage.getItem('accessToken'),
				'Content-Type': 'application/json' }
			
		});

		if ( response.status == 200 )
		{
			window.location.href = '/chat/chat.html';
			//const postItem = await response.json();
			//const res =  this.update_message_list(postItem);	
			//alert ("Success! Res: " + res)	  ;
		}
		else 
		{
			const err = await response.text();
			alert( err );
		}
	}
	async hande_message_input_box(event) {
		this.setState({ [event.target.name]: event.target.value });
   }

};