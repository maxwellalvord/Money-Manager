import { Button } from '@/components/ui/button'
import { PenBox } from 'lucide-react'
import React from 'react'

function EditBudget() {
  return (
    <div>
        <Button className='flex gap-2'> <PenBox/> Edit</Button>
    </div>
  )
}

export default EditBudget