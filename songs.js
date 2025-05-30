async function fetchSongs() {
  const query = document.getElementById("searchid").value.trim();
  const searchType = document.getElementById("searchType").value;
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "";

  if (!query) {
    resultsDiv.textContent = "Please enter a search term.";
    return;
  }

  let apiURL = "";

  if (searchType === "song") {
    apiURL = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=20`;
  } else if (searchType === "album") {
    apiURL = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=album&limit=20`;
  } else if (searchType === "artist") {
    apiURL = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=50`;
  }

  try {
    const response = await fetch(apiURL);

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await response.json();
    let filteredResults = data.results;

    if (searchType === "artist") {
      filteredResults = data.results.filter(song =>
        song.artistName.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (filteredResults.length === 0) {
      resultsDiv.textContent = "No results found.";
      return;
    }

    filteredResults.forEach(item => {
      const itemDiv = document.createElement("div");
      itemDiv.className = "result-item"; // Add class for styling

      // Image
      const img = document.createElement("img");
      img.src = item.artworkUrl100 ? item.artworkUrl100.replace("100x100bb", "350x350bb") : "default-placeholder.jpg";
      img.alt = "Artwork";

      // Info container
      const infoDiv = document.createElement("div");
      infoDiv.className = "result-info";

      // Title
      const title = document.createElement("span");
      title.textContent = searchType === "album" ? `Album: ${item.collectionName}` : `Title: ${item.trackName || item.collectionName}`;

      // Artist
      const artist = document.createElement("span");
      artist.textContent = `Artist: ${item.artistName}`;

      // Track link
      const track = document.createElement("a");
      track.href = item.trackViewUrl;
      track.textContent = "Listen on iTunes";
      track.target = "_blank";

      // Append info to infoDiv
      infoDiv.appendChild(title);
      infoDiv.appendChild(artist);
      infoDiv.appendChild(track);

      // Append everything to itemDiv
      itemDiv.appendChild(img);
      itemDiv.appendChild(infoDiv);

      // Append itemDiv to results
      resultsDiv.appendChild(itemDiv);
    });
  } catch (error) {
    console.error(error);
    resultsDiv.textContent = "Error fetching data.";
  }
}
