'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { authClient } from '@/lib/auth-client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export default function ProfilePage() {
   const { data: sessionData } = authClient.useSession()
   const user = sessionData?.user
   const userId = user?.id || ''
   const email = user?.email || ''

   const [name, setName] = useState('')
   const [image, setImage] = useState('')
   const [saving, setSaving] = useState(false)
   const [imgError, setImgError] = useState(false)

   useEffect(() => {
      if (user) {
         setName(user.name || '')
         setImage(user.image || '')
      }
   }, [user])

   const previewSrc = imgError
      ? '/placeholder-avatar.png'
      : (image || user?.image || '/placeholder-avatar.png')

   const handleSubmit = async (e) => {
      e.preventDefault()

      const trimmedName = name.trim()
      const trimmedImage = image.trim()

      if (!trimmedName && !trimmedImage) {
         toast.error('Please update at least one field')
         return
      }

      setSaving(true)

      try {
         const payload = {}
         if (trimmedName) payload.name = trimmedName
         if (trimmedImage) payload.image = trimmedImage

         const res = await fetch(`${API_BASE}/users/${userId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
         })

         const data = await res.json()

         if (!res.ok) throw new Error(data.message || 'Update failed')

         toast.success('Profile updated successfully')
         setImgError(false)
      } catch (error) {
         toast.error(error.message)
      } finally {
         setSaving(false)
      }
   }

   return (
      <div className="min-h-screen bg-slate-50/50 px-4 py-6 dark:bg-zinc-900/40">
         <div className="mx-auto max-w-md">
            <Card className="rounded-2xl shadow-sm border border-slate-200 dark:border-zinc-800">
               <CardContent className="p-8 space-y-8">

                  {/* Header */}
                  <div className="text-center space-y-1">
                     <h1 className="text-2xl font-semibold tracking-tight">My Profile</h1>
                     <p className="text-sm text-muted-foreground">
                        Update your display name and avatar
                     </p>
                  </div>

                  {/* Avatar preview */}
                  <div className="flex flex-col items-center gap-3">
                     <div className="relative">
                        <img
                           key={previewSrc}
                           src={previewSrc}
                           alt="profile"
                           onError={() => setImgError(true)}
                           onLoad={() => setImgError(false)}
                           className="h-24 w-24 rounded-full border-2 border-slate-200 dark:border-zinc-700 object-cover shadow-sm transition-all duration-300"
                        />
                        {/* Online indicator dot */}
                        <span className="absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-zinc-900" />
                     </div>
                     <div className="text-center">
                        <p className="font-medium text-sm">{user?.name || '—'}</p>
                        <p className="text-xs text-muted-foreground">{email}</p>
                     </div>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-5">

                     <div className="space-y-1.5">
                        <Label htmlFor="name" className="text-sm font-medium">
                           Display Name
                        </Label>
                        <Input
                           id="name"
                           value={name}
                           onChange={e => setName(e.target.value)}
                           placeholder="Your name"
                           autoComplete="off"
                        />
                     </div>

                     <div className="space-y-1.5">
                        <Label htmlFor="imageUrl" className="text-sm font-medium">
                           Avatar URL
                        </Label>
                        <Input
                           id="imageUrl"
                           value={image}
                           onChange={e => {
                              setImage(e.target.value)
                              setImgError(false)
                           }}
                           placeholder="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNL_ZnOTpXSvhf1UaK7beHey2BX42U6solRA&s"
                           autoComplete="off"
                        />
                        {imgError && image && (
                           <p className="text-xs text-destructive">
                              Could not load image — check the URL
                           </p>
                        )}
                     </div>

                     <div className="space-y-1.5">
                        <Label htmlFor="email" className="text-sm font-medium text-muted-foreground">
                           Email (read-only)
                        </Label>
                        <Input
                           id="email"
                           value={email}
                           disabled
                           className="bg-slate-100 dark:bg-zinc-800 text-muted-foreground text-sm cursor-not-allowed"
                        />
                     </div>

                     <Button
                        className="w-full"
                        type="submit"
                        disabled={saving}
                     >
                        {saving ? 'Saving…' : 'Save Changes'}
                     </Button>
                  </form>

               </CardContent>
            </Card>
         </div>
      </div>
   )
}