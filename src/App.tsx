import { ChangeEvent, useState } from "react"
import { NewNoteCard } from "./Components/new-note-card"
import { NoteCard } from "./Components/note-card"
import Logo from "./assets/Logo.svg"

export function App() {

  interface Note {
    id: string,
    date: Date,
    content: string
  }


  const [search, setSearch] = useState("")
  const [notes, setNotes] = useState<Note[]>(() => {
    const NoteOnStorage = localStorage.getItem("notes")
    if(NoteOnStorage){
      return JSON.parse(NoteOnStorage)
    }
    return[]
  })

  function addNote(content: string) {
    const newNote = {
      id: crypto.randomUUID(),
      date: new Date(),
      content,
    }

    const notesArray = [newNote, ...notes]
    setNotes(notesArray)
    localStorage.setItem("notes", JSON.stringify(notesArray))
  }

  function onNoteDeleted(id: string) {
    const notesArray = notes.filter(notes => {
      return notes.id !== id
    })
    setNotes(notesArray)
    localStorage.setItem("notes", JSON.stringify(notesArray))
  }

  function handleSearch(e: ChangeEvent<HTMLInputElement>) {
    const query = e.target.value

    setSearch(query)
  }
  const filteredNote = search !== "" ? notes.filter(note => note.content.toLocaleLowerCase().includes(search.toLocaleLowerCase())) : notes

  return (
    <div className="mx-auto max-w-6xl my-12 space-y-6 px-5">
      <img src={Logo} alt="NLW Expert"/>
      <form className="w-full">
        <input 
        type="text" 
        placeholder="Busque em suas nota..."
        className="w-full bg-transparent text-3xl font-semibold tracking-tight outline-none placeholder:text-slate-500"
        onChange={handleSearch}
        />
      </form>

      <div className="h-px bg-slate-700"/>


      <div className="grid grid-cols-3 gap-6 auto-rows-[250px]">


        <NewNoteCard addNote={addNote}/>
        {
          filteredNote.map(note => {
           return <NoteCard key={note.id} note={note} onNoteDeleted={onNoteDeleted}/>
          })
        }


      </div>
    </div>
  )
}

