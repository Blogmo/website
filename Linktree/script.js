function toggleTheme() {
      const body = document.body;
      body.classList.toggle('dark-mode');

      const sunIcon = document.querySelector('.fa-sun');
      const moonIcon = document.querySelector('.fa-moon');

      if (body.classList.contains('dark-mode')) {
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'inline-block';
      } else {
        sunIcon.style.display = 'inline-block';
        moonIcon.style.display = 'none';
      }
    }

    function encodeProfileURL(username) {
      return 'profile.html?data=' + btoa('username=' + encodeURIComponent(username));
    }

    function loadCSV() {
      const xhr = new XMLHttpRequest();
      const linksContainer = document.getElementById('links-container');
      const loadingIndicator = document.querySelector('.loading');

      xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          if (xhr.status === 200) {
            const csvData = xhr.responseText;
            const rows = csvData.split('\n');

            const savedLinks = getSavedLinks();

            for (let i = 1; i < rows.length; i++) {
              const columns = rows[i].split(',');
              const title = columns[0];
              const link = columns[1].trim();

              const linkBox = document.createElement('div');
              linkBox.className = 'link-box';
              linkBox.innerHTML = `<a href="${link}" target="_blank">${title}</a>`;

              if (savedLinks.includes(link)) {
                linkBox.classList.add('saved-link');
              }
              linkBox.addEventListener('click', function () {
                saveLink(link);
                this.classList.add('saved-link');
              });

              linksContainer.appendChild(linkBox);
            }
      
            loadingIndicator.style.display = 'none';
          } else {
            console.error('Failed to fetch CSV data.');
          }
        }
      };

      xhr.open('GET', 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRjqX-o_V_9g8T3zlm5SBGMRx7XfeOj1dF824OgKbsiMtg3LuvzXxjyw4IHH9nMWHICsfaRxpl4sGjv/pub?gid=0&single=true&output=csv', true);
      // Tampilkan indikator loading saat mengambil data
      loadingIndicator.style.display = 'block';
      xhr.send();
    }

    function getSavedLinks() {
      const savedLinks = Cookies.get('savedLinks');
      return savedLinks ? savedLinks.split(',') : [];
    }

    function saveLink(link) {
      const savedLinks = getSavedLinks();
      savedLinks.push(link);
      Cookies.set('savedLinks', savedLinks.join(','), { expires: 365 });
    }

    loadCSV();
