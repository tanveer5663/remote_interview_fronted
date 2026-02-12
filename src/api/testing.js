for (let i = 0; i < 10; i++) {
  const fetchApi = async () => {
    fetch("http://localhost:5113/api/health/detailed/55")
      .then((response) => response.json())
      .then((data) => console.log(data)).catch((error) => console.error("Error fetching data:", error));
  };
  fetchApi();
}
