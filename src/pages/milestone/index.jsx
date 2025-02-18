import React from 'react'
import { useParams } from 'react-router-dom'

function MilestonePage() {
    const {milestoneId} = useParams()
    console.log(milestoneId)
  return (
    <div>MilestonePage</div>
  )
}

export default MilestonePage