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
					<form className='formcontainer'>
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

					</form>
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
	    this.state = {messages: [], messageText: ""};
		
	}

    //initial fetch
    async componentDidMount() 
	{
		const messages = await this.fetch_messages();
		this.update_message_list(messages);
	}

	//should filter by time


    render() {
			return  <div className="main-block" >
						<div className="container">
							<div>
								<textarea 
								type="name"
								name="messageText"
								placeholder="write message here: when finished, press the submit button to upload the message."
								value={this.state.messageText} 
								onChange={this.hande_message_input_box}
								required
							/>
							</div>
							<div>
								<button className = "button"
									type="submit" 
									name= "Submit"
									onClick = {this.handle_message_submit}>
									Send Message
								</button>
							</div>
						</div>	

						<div > Recent Messages to me:
						{this.state.messages.map( (item,index) => { return  <MessageItem  message={item}  key={index}/>  }  ) } 
						</div>
			  		 </div>
			   //add posts.sort(predicate(date))
			   //map only 10 posts from server
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
		const response = await fetch('/api/admin/sendMessageToAllUsers', 
		{
			method: 'POST',
			body: JSON.stringify({messageText : this.state.messageText}),
			headers: { 
				'Authorization': 'BEARER ' + sessionStorage.getItem('accessToken'),
				'Content-Type': 'application/json' }
			
		});

		if ( response.status == 200 )
		{
			this.update_message_list(await this.fetch_messages());
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