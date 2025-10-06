import React, { useMemo } from "react"
import { Pie } from 'react-chartjs-2'
import stringSimilarity from 'string-similarity'

const GenreChart = ({ genreData }) => {
  const chartData = useMemo(() => {
    if (!genreData || !Array.isArray(genreData)) {
      return { labels: [], datasets: [] }
    }
    console.log(genreData)

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

    // Convert to array and sort by frequency
    const genreTotalsArray = Object.entries(genreTotals).map(([key, value]) => ({
      name: key,
      value: value
    }))
    
    // Sort by frequency (highest first) and take top genres
    const sortedGenres = genreTotalsArray.sort((a, b) => b.value - a.value)

    // Group similar genres together
    const groupedGenres = []
    const processedGenres = new Set()

    for (let i = 0; i < sortedGenres.length; i++) {
      if (processedGenres.has(sortedGenres[i].name)) continue

      const currentGenre = sortedGenres[i]
      let totalCount = currentGenre.value
      let representativeName = currentGenre.name

      // Look for similar genres to group together
      for (let j = i + 1; j < sortedGenres.length; j++) {
        if (processedGenres.has(sortedGenres[j].name)) continue

        const similarityValue = stringSimilarity.compareTwoStrings(
          currentGenre.name, 
          sortedGenres[j].name
        )

        // If genres are similar (similarity > 0.3), group them together
        if (similarityValue > 0.3) {
          totalCount += sortedGenres[j].value
          // Use the shorter name as representative
          if (sortedGenres[j].name.length < representativeName.length) {
            representativeName = sortedGenres[j].name
          }
          processedGenres.add(sortedGenres[j].name)
        }
      }

      groupedGenres.push({
        name: representativeName,
        value: totalCount
      })
      processedGenres.add(currentGenre.name)
    }

    // Take top 10 grouped genres for better visualization
    const finalGenres = groupedGenres
      .sort((a, b) => b.value - a.value)
      .slice(0, 10)

    const labels = finalGenres.map(genre => genre.name)
    const values = finalGenres.map(genre => genre.value)

    // Generate more colors for better variety
    const colors = [
      '#FF6384', '#36A2EB', '#FFCE56', '#39B838', '#A838B8',
      '#FF9F40', '#4BC0C0', '#9966FF', '#FF99CC', '#FF6B6B',
    ]

    return {
      labels,
      datasets: [{
        data: values,
        backgroundColor: colors.slice(0, labels.length),
        hoverBackgroundColor: colors.slice(0, labels.length),
        borderColor: '#000205',
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
          color: "#ffffff",
          font: {
            size: 11
          },
          padding: 10
        },
        position: 'right',
        align: 'start'
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        callbacks: {
          label: function(context) {
            const label = context.label || ''
            const value = context.parsed
            const total = context.dataset.data.reduce((a, b) => a + b, 0)
            const percentage = ((value / total) * 100).toFixed(1)
            return `${label}: ${value} (${percentage}%)`
          }
        }
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
    <div style={{ minHeight: '280px', minWidth: '500px' }}>
      <Pie data={chartData} options={options} />
    </div>
  )
}

export default GenreChart
