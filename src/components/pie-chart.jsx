import React, { useMemo } from "react"
import { Pie } from 'react-chartjs-2'
import stringSimilarity from 'string-similarity'

const GenreChart = ({ genreData }) => {
  const chartData = useMemo(() => {
    if (!genreData || !Array.isArray(genreData)) {
      return { labels: [], datasets: [] }
    }

    // Calculate genre totals
    const genreTotals = {}
    for (let artist of genreData) {
      if (artist.genres && Array.isArray(artist.genres)) {
        for (let genre of artist.genres) {
          if (!genreTotals.hasOwnProperty(genre)) {
            genreTotals[genre] = 1
          } else {
            genreTotals[genre] += 1
          }
        }
      }
    }

    // Get top five genres
    const genreTotalsArray = Object.entries(genreTotals).map(([key, value]) => ({
      name: key,
      value: value
    }))
    
    const topFiveGenres = genreTotalsArray
      .sort((a, b) => b.value - a.value)
      .slice(0, 5)

    // Filter similar genres
    const filteredGenres = []
    for (let y = 0; y < topFiveGenres.length; y++) {
      for (let x = 0; x < topFiveGenres.length; x++) {
        if (!(x === y)) {
          const similarityValue = stringSimilarity.compareTwoStrings(
            topFiveGenres[y].name, 
            topFiveGenres[x].name
          )
          if (similarityValue < 0.5) {
            const genreToPush = topFiveGenres[y].name.length < topFiveGenres[x].name.length ? 
              topFiveGenres[y] : 
              topFiveGenres[x]
            filteredGenres.push({
              name: genreToPush.name, 
              value: genreToPush.value
            })
          }
        }
      }
    }

    // Use filtered genres if available, otherwise use top five
    const finalGenres = filteredGenres.length > 0 ? filteredGenres : topFiveGenres

    const labels = finalGenres.map(genre => genre.name)
    const values = finalGenres.map(genre => genre.value)

    return {
      labels,
      datasets: [{
        data: values,
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#39B838', '#A838B8'
        ],
        hoverBackgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#39B838', '#A838B8'
        ],
        borderColor: [
          '#000205', '#000205', '#000205', '#000205', '#000205'
        ],
        borderWidth: 1
      }]
    }
  }, [genreData])

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: "#666",
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff'
      }
    }
  }

  if (!genreData || genreData.length === 0) {
    return (
      <div className="text-center p-4">
        <p className="text-muted">No genre data available</p>
      </div>
    )
  }

  return (
    <div style={{ height: '300px', width: '100%' }}>
      <Pie data={chartData} options={options} />
    </div>
  )
}

export default GenreChart
