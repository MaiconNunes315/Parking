interface Veiculo{
    name: string;
    board: string;
    input: Date | string;
    dates: Date | string;
}

(function(){
    const $ = (query: string):HTMLInputElement | null =>
    document.querySelector(query);

    function calcTime(mil: number){

        const min = Math.floor(mil / 60000)
        const hor = Math.floor(min / 60)
        const rest = (min % 60)

        return `${hor} horas e ${rest} minutos`
    }

    function courtyard(){
        function read():Veiculo[]{
            return localStorage.courtyard ? JSON.parse(localStorage.courtyard):[];
        }

        function save(veiculos: Veiculo[]){
            localStorage.setItem('courtyard', JSON.stringify(veiculos))
        }

        function add( veiculo: Veiculo, salvar?: boolean){

            
            const row = document.createElement('tr');
            row.innerHTML = `
            <td>${veiculo.name}</td>
            <td>${veiculo.board}</td>
            <td>${veiculo.dates}</td>
            <td><button class="delete" data-board="${veiculo.board}">X</button></td>
            `
            row.querySelector('.delete')?.addEventListener('click', function(){
                remove(this.dataset.board as string)
            })

            $('#courtyard')?.appendChild(row);

            if(salvar){save([...read(), veiculo])}
        }

        function remove(board: string){
            const {input, name} = read().find(veiculo => veiculo.board === board)
                        
            const time = calcTime(new Date().getTime() - new Date(input).getTime())
              
            const timeHour = Number(time.substring(0, (time.replace(" ", " - ").search('-')) - 1))
            const value = ( (timeHour + 1) * 3).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});
            
            
            if(!confirm(`O veiculo ${name}, permaneceu por ${time}. O valor ficou em: ${value} Deseja encerrar?`)) return

            save(read().filter((veiculo)=> veiculo.board !== board))
            render()
        }

        

        function render(){
            $('#courtyard')!.innerHTML = " ";
            const courtyard = read();

            if(courtyard.length){
                courtyard.forEach((veiculo)=>add(veiculo))

            }

        }

        return{ read, add, remove, save, render}
    }

    courtyard().render()

    $('#register')?.addEventListener('click', ()=>{
        const name = $('#name')?.value;
        const board = $('#board')?.value.toLocaleUpperCase();
      
        if(!name||!board){
            alert('Os campos nome e placa são obrigatórios')
            return
        }

        const day = new Date().getDay()
        const month = ["Janeiro","fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro",]
        const monthPortugues = month[new Date().getMonth()]
        const year = new Date().getFullYear()
        const hour = new Date().getHours()
        const minutes = new Date().getMinutes().toString()

        courtyard().add({ name, board, input:new Date().toISOString() , dates: `${day}/${monthPortugues}/${year} - ${hour}:${minutes}`  },true)
        
        $('#name').value = " ";
        $('#board').value = " "; 
    })

})();