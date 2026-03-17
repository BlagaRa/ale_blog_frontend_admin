'use client'

import { useCollaborationStore } from "@/store/collaborationStore"
import { useEffect, useState } from "react"
import Link from "next/link"

function Page() {

  const { collaborations, getCollaborations, isLoading } = useCollaborationStore()

  const [genFilter, setGenFilter] = useState("")
  const [dateFilter, setDateFilter] = useState("")

  useEffect(() => {
    getCollaborations()
  }, [getCollaborations])

  const filtered = collaborations.filter((c) => {

    if (genFilter && c.gen !== genFilter) return false

    if (dateFilter) {
      const d1 = new Date(c.createdAt).toDateString()
      const d2 = new Date(dateFilter).toDateString()
      if (d1 !== d2) return false
    }

    return true
  })

  if (isLoading) return <div className="p-10">Loading...</div>

  return (
    <div className="p-10 flex flex-col gap-8">

      <h1 className="text-5xl font-serif">Collaborations</h1>

      <div className="flex gap-6">

        <select
          value={genFilter}
          onChange={(e)=>setGenFilter(e.target.value)}
          className="border-2 border-accent p-2 rounded-xl"
        >
          <option value="">All genres</option>
          <option value="ROMANCE">ROMANCE</option>
          <option value="ACTION">ACTION</option>
          <option value="FICTION">FICTION</option>
          <option value="THRILLER">THRILLER</option>
          <option value="HORROR">HORROR</option>
        </select>

        <input
          type="date"
          value={dateFilter}
          onChange={(e)=>setDateFilter(e.target.value)}
          className="border-2 border-accent p-2 rounded-xl"
        />

      </div>

      <div className="flex flex-col gap-6">

        {filtered.map((collab)=>(
          <Link
            key={collab.id}
            href={`/contacts/${collab.id}`}
            className="border-2 border-accent p-6 rounded-xl hover:shadow-lg transition"
          >

            <div className="flex justify-between">

              <div>
                <h2 className="text-2xl font-serif">
                  {collab.bookTitle}
                </h2>

                <p className="opacity-70">
                  {collab.personName}
                </p>

                <p className="opacity-60 text-sm">
                  {collab.email}
                </p>
              </div>

              <div className="text-right">

                <p className="border px-2 rounded-lg">
                  {collab.gen}
                </p>

                <p className="text-sm opacity-60">
                  {new Date(collab.createdAt).toDateString()}
                </p>

                <p
                    className={`px-2 border rounded-lg mt-2 text-sm font-semibold 
                    ${collab.status === "JUST_SENT" && "bg-yellow-200 text-yellow-800"}
                    ${collab.status === "IN_PROCESS" && "bg-blue-200 text-blue-800"}
                    ${collab.status === "READ" && "bg-green-200 text-green-800"}
                    ${collab.status === "REJECTED" && "bg-red-200 text-red-800"}
                    `}
                    >
                    {collab.status}
                </p>

              </div>

            </div>

          </Link>
        ))}

      </div>

    </div>
  )
}

export default Page