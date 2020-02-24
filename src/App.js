import React, { useState } from 'react'
import {
	BrowserRouter as Router,
	Switch, Route, Link, useParams, useHistory
  } from "react-router-dom"
import {useField} from './hooks'

const Menu = (props) => {
  const padding = {
    paddingRight: 5
  }
  return (
	<Router>
		<div>
			<Link style={padding} to='/'>anecdotes</Link>
			<Link style={padding} to='/create'>create new</Link>
			<Link style={padding} to='/about'>about</Link>
		</div>
		<Notification message={props.notification}/>
		<Switch>
			<Route path='/anecdotes/:id'>
				<Anecdote anecdotes={props.anecdotes}/>
			</Route>
			<Route path='/create'>
				<CreateNew addNew={props.addNew} setNotification={props.setNotification}/>
			</Route>
			<Route path='/about'>
				<About/>
			</Route>
			<Route path='/'>
				<AnecdoteList anecdotes={props.anecdotes}/>
			</Route>
		</Switch>
	</Router>
  )
}

const AnecdoteList = ({ anecdotes }) => (
  <div>
    	<h2>Anecdotes</h2>
		<ul>
			{anecdotes.map(anecdote =>
				<li key={anecdote.id} >
					<Link to={`/anecdotes/${anecdote.id}`}>{anecdote.content}</Link>
				</li>)}
		</ul>
  </div>
)

const Anecdote = ({ anecdotes }) => {
	const id = useParams().id
	const anecdote = anecdotes.find(a => a.id === id)
	console.log('anekdootti: ', anecdote)

	return (
		<div>
			<h2>{anecdote.content}</h2>
			<p>has {anecdote.votes} votes</p>
			<p>for more info see <a href={anecdote.info}>{anecdote.info}</a></p>
		</div>
	)
}

const About = () => (
  <div>
    <h2>About anecdote app</h2>
    <p>According to Wikipedia:</p>

    <em>An anecdote is a brief, revealing account of an individual person or an incident.
      Occasionally humorous, anecdotes differ from jokes because their primary purpose is not simply to provoke laughter but to reveal a truth more general than the brief tale itself,
      such as to characterize a person by delineating a specific quirk or trait, to communicate an abstract idea about a person, place, or thing through the concrete details of a short narrative.
      An anecdote is "a story with a point."</em>

    <p>Software engineering is full of excellent anecdotes, at this app you can find the best and add more.</p>
  </div>
)

const Footer = () => (
  <div>
    Anecdote app for <a href='https://courses.helsinki.fi/fi/tkt21009'>Full Stack -websovelluskehitys</a>.

    See <a href='https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js'>https://github.com/fullstack-hy2019/routed-anecdotes/blob/master/src/App.js</a> for the source code.
  </div>
)

const CreateNew = (props) => {
	let history = useHistory()
	const content = useField('text')
	const author = useField('text')
	const info = useField('text')
	let fields = [{...content}, {...author}, {...info}]
	
	fields.forEach(element => {
		delete element.reset
	})
	
	const handleReset = (e) => {
		e.preventDefault()
		content.reset()
		author.reset()
		info.reset()
	}

	const handleSubmit = (e) => {
		e.preventDefault()
		console.log('content: ', content)
		props.addNew({
		content: content.value,
		author: author.value,
		info: info.value,
		votes: 0
		})
		history.push('/')
		props.setNotification(`a new anecdote ${content.value} created!`)
		setTimeout(() => {
			props.setNotification(null)
		}, 10000)
	}
	
	return (
		<div>
		<h2>create a new anecdote</h2>
		<form onSubmit={handleSubmit} onReset={handleReset}>
			<div>
			content
			<input {...fields[0]} />
			</div>
			<div>
			author
			<input {...fields[1]} />
			</div>
			<div>
			url for more info
			<input {...fields[2]} />
			</div>
			<button type='submit'>create</button>
			<button type='reset'>reset</button>
		</form>
		</div>
	)

}
const Notification = ({ message }) => {
	if (!message) {
		return null
	}
	return (
		<div>
			{ message }
		</div>
	)



}

const App = () => {
  const [anecdotes, setAnecdotes] = useState([
    {
      content: 'If it hurts, do it more often',
      author: 'Jez Humble',
      info: 'https://martinfowler.com/bliki/FrequencyReducesDifficulty.html',
      votes: 0,
      id: '1'
    },
    {
      content: 'Premature optimization is the root of all evil',
      author: 'Donald Knuth',
      info: 'http://wiki.c2.com/?PrematureOptimization',
      votes: 0,
      id: '2'
    }
  ])

  const [notification, setNotification] = useState(null)

  const addNew = (anecdote) => {
    anecdote.id = (Math.random() * 10000).toFixed(0)
    setAnecdotes(anecdotes.concat(anecdote))
  }

  const anecdoteById = (id) =>
    anecdotes.find(a => a.id === id)

  const vote = (id) => {
    const anecdote = anecdoteById(id)

    const voted = {
      ...anecdote,
      votes: anecdote.votes + 1
    }

    setAnecdotes(anecdotes.map(a => a.id === id ? voted : a))
  }

  return (
    <div>
      <h1>Software anecdotes</h1>
      <Menu addNew={addNew} anecdotes={anecdotes} notification={notification} setNotification={setNotification}/>
      <Footer />
    </div>
  )
}

export default App;
