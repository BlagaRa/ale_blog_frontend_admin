'use client'

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Collaboration, useCollaborationStore } from "@/store/collaborationStore"

function Page(){

  const { id } = useParams()
  const router = useRouter()

  const {
    selectedCollaboration,
    getCollaborationById,
    editCollaboration,
    deleteCollaboration,
    error,
    isLoading
  } = useCollaborationStore()

  const [isEditing,setIsEditing]=useState(false)
  const [formData,setFormData]=useState<any>({})

  useEffect(()=>{
    const colaborationGetter=()=>{
        if(id){
            getCollaborationById(id as string)
        }
    }
    colaborationGetter();

    
  },[])

  useEffect(()=>{
    
    const dataSetter=()=>{
        if(selectedCollaboration){
            setFormData(selectedCollaboration);
        }
    }
    dataSetter();
  },[selectedCollaboration])

  const handleChange=(e:any)=>{
    const {name,value}=e.target

    setFormData((prev:any)=>({
      ...prev,
      [name]:value
    }))
  }

  const handleSubmit = async (e:any) => {
  e.preventDefault()

  const success = await editCollaboration(id as string, formData)

  if(success){
    await getCollaborationById(id as string) 
    setIsEditing(false)
  }
}

  const handleDelete=async()=>{
    const confirmDelete=confirm("Delete this collaboration request?")

    if(!confirmDelete) return

    const success=await deleteCollaboration(id as string)

    if(success){
      router.push("/contacts")
    }
  }

  if (!selectedCollaboration) {
    return <div className="p-10">Loading data...</div>
  }

  return(
    <div className="p-10 flex flex-col gap-8 max-w-3xl">

      <div className="flex justify-between">

        <h1 className="text-4xl font-serif">
          Collaboration Request
        </h1>
        

        <div className="flex gap-3">

          {!isEditing && (
            <button
              onClick={()=>setIsEditing(true)}
              className="bg-accent text-white px-4 py-2 rounded-xl"
            >
              Edit
            </button>
          )}

          <button
            onClick={handleDelete}
            className="bg-red-600 text-white px-4 py-2 rounded-xl"
          >
            Delete
          </button>

        </div>

      </div>
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-xl border border-red-400">
          {error}
        </div>
      )}

      {/* VIEW MODE */}

      {!isEditing && (
        <div className="flex flex-col gap-4">

          <p><b>Book Title:</b> {selectedCollaboration.bookTitle}</p>

          <p><b>Description:</b></p>
          <p className="border p-4 rounded-xl">
            {selectedCollaboration.bookDescription}
          </p>

          <p><b>Genre:</b> {selectedCollaboration.gen}</p>

          <p><b>Author:</b> {selectedCollaboration.personName}</p>

          <p><b>Email:</b> {selectedCollaboration.email}</p>

          <p><b>Phone:</b> {selectedCollaboration.phoneNumber || "—"}</p>

          <p><b>Message:</b></p>
          <p className="border p-4 rounded-xl">
            {selectedCollaboration.message || "—"}
          </p>

          <p><b>Reason:</b> {selectedCollaboration.reasonOfContact}</p>

          <p>
            <b>Status:</b>{" "}
            <span className="border px-2 rounded-lg">
              {selectedCollaboration.status}
            </span>
          </p>

        </div>
      )}

      {/* EDIT MODE */}

      {isEditing && (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
        >

          <input
            name="bookTitle"
            value={formData.bookTitle || ""}
            onChange={handleChange}
            className="border p-3 rounded-xl"
          />

          <textarea
            name="bookDescription"
            value={formData.bookDescription || ""}
            onChange={handleChange}
            className="border p-3 rounded-xl"
          />

          <select
            name="gen"
            value={formData.gen}
            onChange={handleChange}
            className="border p-3 rounded-xl"
          >
            <option value="ROMANCE">ROMANCE</option>
            <option value="ACTION">ACTION</option>
            <option value="FICTION">FICTION</option>
            <option value="THRILLER">THRILLER</option>
            <option value="PERSONAL_DEVELOPMENT">PERSONAL_DEVELOPMENT</option>
            <option value="FOR_KIDS">FOR_KIDS</option>
            <option value="HISTORICAL">HISTORICAL</option>
            <option value="HORROR">HORROR</option>
          </select>

          <input
            name="personName"
            value={formData.personName || ""}
            onChange={handleChange}
            className="border p-3 rounded-xl"
          />

          <input
            name="email"
            value={formData.email || ""}
            onChange={handleChange}
            className="border p-3 rounded-xl"
          />

          <input
            name="phoneNumber"
            value={formData.phoneNumber || ""}
            onChange={handleChange}
            className="border p-3 rounded-xl"
          />

          <textarea
            name="message"
            value={formData.message || ""}
            onChange={handleChange}
            className="border p-3 rounded-xl"
          />

          <select
            name="reasonOfContact"
            value={formData.reasonOfContact}
            onChange={handleChange}
            className="border p-3 rounded-xl"
          >
            <option value="BOOK_REVIEW">BOOK_REVIEW</option>
            <option value="MERCH_REVIEW">MERCH_REVIEW</option>
            <option value="BLOG_TOUR">BLOG_TOUR</option>
            <option value="GENERAL_QUESTION">GENERAL_QUESTION</option>
            <option value="NEW_BLOGGER">NEW_BLOGGER</option>
            <option value="NOT_LISTED">NOT_LISTED</option>
          </select>

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="border p-3 rounded-xl"
          >
            <option value="JUST_SENT">JUST_SENT</option>
            <option value="IN_PROCESS">IN_PROCESS</option>
            <option value="READ">READ</option>
            <option value="REJECTED">REJECTED</option>
          </select>

          <div className="flex gap-3">

            <button
              type="submit"
              className="bg-accent text-white px-4 py-2 rounded-xl"
            >
              Save
            </button>

            <button
              type="button"
              onClick={()=>setIsEditing(false)}
              className="border px-4 py-2 rounded-xl"
            >
              Cancel
            </button>

          </div>

        </form>
      )}

    </div>
  )
}

export default Page