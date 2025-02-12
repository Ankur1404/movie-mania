

const search = ({search,setSearch}) => {
  return (
    <div className="search">
      <div>
        <img src="search.svg" alt="" />

      <input type="text" placeholder="Looking for action, romance, or thrill? Start typing... 🎭" 
      value={search}
      onChange={(e)=>setSearch(e.target.value)}/>

      </div>
   
    </div>
  )
}

export default search
