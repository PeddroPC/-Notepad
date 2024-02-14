import * as Dialog from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { ChangeEvent, FormEvent, useState } from "react"
import { toast } from "sonner"


interface NewNoteCardProps{
  addNote: (content: string) => void
}

let speechRecorgnition: SpeechRecognition | null = null

export function NewNoteCard({ addNote }: NewNoteCardProps) {

  const [shouldShowOnboarding, setShouldShowOnboarding] = useState(true)
  const [isRecording, setIsRecording] = useState(false)
  const [content, setContent] = useState("")

  function handleStartEditor() {
    setShouldShowOnboarding(false)
  }
  function handleContentChanged(e: ChangeEvent<HTMLTextAreaElement>) {
    setContent(e.target.value)

     if(e.target.value === ""){
      setShouldShowOnboarding(true)
     }
  }
  function handleSaveNote (e: FormEvent){
    e.preventDefault()
    if (content === '') {
      return
    }
    addNote(content);
    setContent("")
    toast.success("Nota criada com sucesso!")

  }
  function handleStartRecording () {

      const isSpeechRecognitionAPIAvailable = "SpeechRecognition" in window
      || "webkitSpeechRecognition" in window

      if (!isSpeechRecognitionAPIAvailable) {
        alert("Infelizmente seu navegador não suporta a API de gravação!")
        return
      }

      setIsRecording(true)
      setShouldShowOnboarding(false)

      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition
      speechRecorgnition = new SpeechRecognitionAPI()
      speechRecorgnition.lang = "pt-BR"
      speechRecorgnition.continuous = true
      speechRecorgnition.maxAlternatives = 1
      speechRecorgnition.interimResults = true

      speechRecorgnition.onresult = (e) => {
        const transcription = Array.from(e.results).reduce((text, result) => {
          return text.concat(result[0].transcript)
        }, "")
        setContent(transcription)
      }
      speechRecorgnition.onerror = (e) => {
        console.error(e)
      }
      speechRecorgnition.start()
  }
  function handleStopRecording(){
    setIsRecording(false)

    if (speechRecorgnition !== null) {
      speechRecorgnition.stop()
    }
  }

    return(
      <Dialog.Root>
        <Dialog.Trigger className="rounded-md flex flex-col bg-slate-700 p-5 text-left gap-3 hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400">
          <span className="text-sm font-medium text-slate-200">
            Adicionar Nota
            </span>
          <p className="test-sm leading-6 text-slate-400">
            Grave uma nota em áudio que será convertida para texto automaticamente.
          </p>
        </Dialog.Trigger>

        <Dialog.Portal>
                <Dialog.Overlay className="inset-0 fixed bg-black/60"/>
                <Dialog.Content className="fixed overflow-hidden left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[640px] w-full bg-slate-700 h-[60vh] rounded-md flex flex-col outline-none">
                    <Dialog.Close className="absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400 outline-none hover:text-slate-100">
                        <X className="size-5"/>
                    </Dialog.Close>


                    <form className="flex-1 flex flex-col">
                    
                      <div className="flex flex-1 flex-col gap-3 p-5">
                          <span className="text-sm font-medium text-slate-200">
                              Adicionar nota
                          </span>
                              {
                                shouldShowOnboarding ? (
                                  <p className="test-sm leading-6 text-slate-400">
                                    Comece <button type="button" onClick={handleStartRecording} className="font-medium text-lime-400 hover:underline">gravando uma nota</button> em áudio ou se preferir <button type="button" onClick={handleStartEditor} className="font-medium text-lime-400 hover:underline">utilize apenas texto.</button>
                                  </p>
                                ) : (
                                  <textarea
                                    autoFocus
                                    className="text-sm leading-6 text-slate-400 bg-transparent resize-none flex-1 outline-none"
                                    onChange={handleContentChanged}
                                    value={content}
                                  />
                                )
                              }
                      </div>

                      {isRecording ? (
                        <button
                        type="button"
                        onClick={handleStopRecording}
                        className="w-full flex items-center justify-center gap-2 bg-slate-900 py-4 text-center text-sm text-slate-300 outline-none font-medium group hover:text-slate-100"
                        >
                          <div className="size-3 rounded-full bg-red-500 animate-pulse"/>
                          Gravando (clique p/ interromper)
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={handleSaveNote}
                          className="w-full bg-lime-400 py-4 text-center text-sm text-lime-950 outline-none font-medium group hover:bg-lime-500"
                        >
                          Salvar nota
                        </button>
                      )}
                      

                    </form>
                </Dialog.Content>
            </Dialog.Portal>
      </Dialog.Root>
    )
}