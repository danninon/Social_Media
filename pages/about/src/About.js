class About extends React.Component 
{	

	constructor(props) 
	{
		super(props);
        this.state = {};
	}

    //initial fetch
    async componentDidMount() 
	{

	}
  
	// async showFile(e)  {
    //     e.preventDefault()
    //     const reader = new FileReader()
    //     reader.onload = async (e) => { 
    //       const text = (e.target.result)
    //       console.log(text)
    //       alert(text)
    //     };
    //     reader.readAsText(e.target.files[0])
    //   }
    //  <input type="file" target="/readme.txt" onChange={(e) => this.showFile(e)} />
	

    render() {
        return <div className={'main-block'}>
            <ToolBar className='ToolBar' />
            <div className={ 'container '}>
                <h1>About</h1>
                <embed src = 'readme.txt'/>
			</div>
         </div>
      }
}