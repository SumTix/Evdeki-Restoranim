        const sidebar = document.getElementById('sidebar');
        const heroCard = document.getElementById('heroCard');
        const container = document.getElementById('floating-items');

        function toggleSidebar(event) {
            event.stopPropagation();
            sidebar.classList.toggle('open');
        }

        function toggleCat(element) {
            const parent = element.parentElement;
            parent.classList.toggle('active');
        }

        document.addEventListener('click', (e) => {
            if (!sidebar.contains(e.target) && sidebar.classList.contains('open')) {
                sidebar.classList.remove('open');
            }
        });

        const foods = [
            {name: 'İtalyan Pizza', puan: 9.8},
            {name: 'Deniz Mahsüllü Makarna', puan: 9.5},
            {name: 'Kinoa Salatası', puan: 8.7},
            {name: 'Fırın Somon', puan: 9.2},
            {name: 'Truffle Burger', puan: 9.4},
            {name: 'San Sebastian', puan: 9.6}
        ];

        foods.forEach((food, index) => {
            const div = document.createElement('div');
            div.className = `side-item pos-${index + 1}`;
            div.setAttribute('data-depth', (index + 1) * 0.1);
            /* Puanın font boyutu da orantılı olarak büyütüldü */
            div.innerHTML = `${food.name} <span style="color:var(--olive-branch); font-size:12px; font-weight:600;">${food.puan}</span>`;
            container.appendChild(div);
        });

        document.addEventListener('mousemove', (e) => {
            const x = (window.innerWidth / 2 - e.pageX) / 30;
            const y = (window.innerHeight / 2 - e.pageY) / 30;

            heroCard.style.transform = `rotateY(${-x}deg) rotateX(${y}deg)`;

            document.querySelectorAll('.side-item').forEach(item => {
                const depth = item.getAttribute('data-depth');
                const moveX = (window.innerWidth / 2 - e.pageX) * depth;
                const moveY = (window.innerHeight / 2 - e.pageY) * depth;
                item.style.transform = `translate(${moveX}px, ${moveY}px)`;
            });
        });

        document.addEventListener('mouseleave', () => {
            heroCard.style.transform = `rotateY(0deg) rotateX(0deg)`;
            document.querySelectorAll('.side-item').forEach(item => {
                item.style.transform = `translate(0px, 0px)`;
            });
        });
