(function () {
    var _a;
    const $ = (query) => document.querySelector(query);
    function calcTime(mil) {
        const min = Math.floor(mil / 60000);
        const hor = Math.floor(min / 60);
        const rest = (min % 60);
        return `${hor} horas e ${rest} minutos`;
    }
    function courtyard() {
        function read() {
            return localStorage.courtyard ? JSON.parse(localStorage.courtyard) : [];
        }
        function save(veiculos) {
            localStorage.setItem('courtyard', JSON.stringify(veiculos));
        }
        function add(veiculo, salvar) {
            var _a, _b;
            const row = document.createElement('tr');
            row.innerHTML = `
            <td>${veiculo.name}</td>
            <td>${veiculo.board}</td>
            <td>${veiculo.dates}</td>
            <td><button class="delete" data-board="${veiculo.board}">X</button></td>
            `;
            (_a = row.querySelector('.delete')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function () {
                remove(this.dataset.board);
            });
            (_b = $('#courtyard')) === null || _b === void 0 ? void 0 : _b.appendChild(row);
            if (salvar) {
                save([...read(), veiculo]);
            }
        }
        function remove(board) {
            const { input, name } = read().find(veiculo => veiculo.board === board);
            const time = calcTime(new Date().getTime() - new Date(input).getTime());
            const timeHour = Number(time.substring(0, (time.replace(" ", " - ").search('-')) - 1));
            const value = ((timeHour + 1) * 3).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });
            if (!confirm(`O veiculo ${name}, permaneceu por ${time}. O valor ficou em:${value} Deseja encerrar?`))
                return;
            save(read().filter((veiculo) => veiculo.board !== board));
            render();
        }
        function render() {
            $('#courtyard').innerHTML = " ";
            const courtyard = read();
            if (courtyard.length) {
                courtyard.forEach((veiculo) => add(veiculo));
            }
        }
        return { read, add, remove, save, render };
    }
    courtyard().render();
    (_a = $('#register')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
        var _a, _b;
        const name = (_a = $('#name')) === null || _a === void 0 ? void 0 : _a.value;
        const board = (_b = $('#board')) === null || _b === void 0 ? void 0 : _b.value.toLocaleUpperCase();
        if (!name || !board) {
            alert('Os campos nome e placa são obrigatórios');
            return;
        }
        const day = new Date().getDay();
        const month = ["Janeiro", "fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",];
        const monthPortugues = month[new Date().getMonth()];
        const year = new Date().getFullYear();
        const hour = new Date().getHours();
        const minutes = new Date().getMinutes().toString();
        courtyard().add({ name, board, input: new Date().toISOString(), dates: `${day}/${monthPortugues}/${year} - ${hour}:${minutes}` }, true);
        $('#name').value = " ";
        $('#board').value = " ";
    });
})();
