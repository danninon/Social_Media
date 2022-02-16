class PostItem extends React.Component 
{
	constructor(props) 
	{
		super(props);
		this.handle_click = this.handle_click.bind( this );
		this.state = { postAutherName: '', postText: '', postTime: '' };
	}
	
	handle_click()
	{
		if ( this.props.set_selected )
			this.props.set_selected( this.props.id );
	}

	render() {
		return <div className={ 'PostItem '}>
					<form className='formcontainer'>
						<div className='container'>
							<label ><strong>Author:</strong></label>
							<label className='PostAuthorName'>{this.props.post.author.name}</label>
					    </div>

						<div className='container'>
							<label ><strong>Text:</strong></label>
							<textarea value={this.props.post.content.text} disabled={true} className='postText'></textarea>
					    </div>

						<div className='container'>
							<label ><strong>Time:</strong></label>
							<label className='postTime'>{this.props.post.content.date}</label>
					    </div>

					</form>
			   </div>
	}
}

//insert add button
class PostsListBox extends React.Component 
{	

	constructor(props) 
	{
		super(props);
	
		this.handle_post_input_box = this.handle_post_input_box.bind(this);
		this.handle_post_submit = this.handle_post_submit.bind(this);

	    this.state = {posts: [], postText: ""};
		
	}

    //initial fetch
    async componentDidMount() 
	{
		const posts = await this.fetch_posts();
		this.update_post_list(posts);
	}

	//when fetch send authenticate!
   
	
	//should filter by time


    render() {
			return  <div className="main-block" >
						<div className="container">
							<div>
								<textarea 
								type="name"
								name="postText"
								placeholder="write post here: when finished, press the submit button to upload the post."
								value={this.state.postText} 
								onChange={this.handle_post_input_box}
								required
							/>
							</div>
							<div>
								<button className = "button"
									type="submit" 
									name= "Submit"
									onClick = {this.handle_post_submit}>
									Submit Post
								</button>
							</div>
						</div>	

						<div > Recent Posts:
						{this.state.posts.map( (item,index) => { return  <PostItem  post={item}  key={index}/>  }  ) } 
						</div>
			  		 </div>
			   //add posts.sort(predicate(date))
			   //map only 10 posts from server
	}

	update_post_list( updated_posts )
	{
		
		this.setState( {posts : updated_posts} );
	}
	
	async fetch_posts()
    {
		 const response = await fetch('/api/users/post/all', {
			headers: {'Authorization': 'BEARER ' + sessionStorage.getItem('accessToken')}
		});
        if (response.status == 200){
            const data = await response.json();
			return data;
        }
		else{
			const err = await response.text();
			alert( err );
		}
	}

	async handle_post_submit(){
		const response = await fetch('/api/users/post', 
		{
			method: 'POST',
			body: JSON.stringify({postText : this.state.postText}),
			headers: { 
				'Authorization': 'BEARER ' + sessionStorage.getItem('accessToken'),
				'Content-Type': 'application/json' }
			
		});

		if ( response.status == 200 )
		{
			this.update_post_list(await this.fetch_posts());
			//const postItem = await response.json();
			//const res =  this.update_post_list(postItem);	
			//alert ("Success! Res: " + res)	  ;
		}
		else 
		{
			const err = await response.text();
			alert( err );
		}
	}
	async handle_post_input_box(event) {
		this.setState({ [event.target.name]: event.target.value });
   }

};