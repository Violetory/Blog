import React, { useState } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import axios from 'axios'
import { useLocation, useNavigate } from 'react-router-dom'
import moment from 'moment'

// TITLE INPUT
const TitleInput = ({ title, setTitle }) => (
  <input
    type="text"
    value={title}
    placeholder="Title"
    onChange={e => setTitle(e.target.value)}
  />
)

// CATEGORY OPTION
const CategoryOption = ({ value, label, onChange, cat }) => (
  <div className="cat">
    <input
      type="radio"
      checked={cat === value}
      name="cat"
      value={value}
      id={value}
      onChange={onChange}
    />
    <label htmlFor={value}>{label}</label>
  </div>
)

// REACT-QUILL EDITOR
const Editor = ({ value, onChange }) => (
  <div className="editorContainer">
    <ReactQuill
      className="editor"
      theme="snow"
      value={value}
      onChange={onChange}
    />
  </div>
)

// PUBLISH COMPONENT
const PublishMenu = ({ file, setFile, handleClick }) => (
  <div className="item">
    <h1>Publish</h1>
    <span>
      <b>State:</b> Draft
    </span>
    <span>
      <b>Visibility:</b> Public
    </span>
    <input
      style={{ display: 'none' }}
      type="file"
      id="file"
      onChange={e => setFile(e.target.files[0])}
    />
    <label className="file" htmlFor="file">
      Upload Image
    </label>
    <div className="buttons">
      <button>Save as a draft</button>
      <button onClick={handleClick}>Publish</button>
    </div>
  </div>
)

// MAIN
const Write = () => {
  const state = useLocation().state
  const navigate = useNavigate()

  const [content, setContent] = useState(state?.desc || '')
  const [title, setTitle] = useState(state?.title || '')
  const [file, setFile] = useState(null)
  const [cat, setCat] = useState(state?.cat || '')

  const upload = async () => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await axios.post('/upload', formData)
      // console.log(res)
      return res.data
    } catch (err) {
      console.log(err)
    }
  }

  const handleClick = async e => {
    e.preventDefault()
    try {
      const imgUrl = file ? await upload() : undefined
      let payload = {
        title,
        desc: content,
        cat,
        img: imgUrl || ''
      }

      if (state?.id) {
        await axios.put(`/posts/${state.id}`, payload)
      } else {
        const date = moment().format('YYYY-MM-DD HH:mm:ss')
        payload = { ...payload, date: date }
        await axios.post(`/posts`, payload)
      }
      navigate('/')
    } catch (err) {
      console.log(err)
    }
  }

  const categories = [
    { value: 'art', label: 'Art' },
    { value: 'science', label: 'Science' },
    { value: 'tech', label: 'Technology' },
    { value: 'cinema', label: 'Cinema' },
    { value: 'design', label: 'Design' },
    { value: 'food', label: 'Food' }
  ]

  return (
    <div className="add">
      <div className="content">
        <TitleInput title={title} setTitle={setTitle} />
        <Editor value={content} onChange={setContent} />
      </div>
      <div className="menu">
        <PublishMenu file={file} setFile={setFile} handleClick={handleClick} />
        <div className="item">
          <h1>Category</h1>
          {categories.map(category => (
            <CategoryOption
              key={category.value}
              value={category.value}
              label={category.label}
              onChange={e => setCat(e.target.value)}
              cat={cat}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Write
