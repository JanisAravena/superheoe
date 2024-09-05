$(document).ready(function () {
    // Inicialmente ocultar la sección de resultados
    $('#oculto').hide();

    $('#formHero').click(function () {
        // Obtener el valor ingresado
        let valorIngresado = $('#valorIngresado').val();
        let resultado = validar(valorIngresado);
        let validacion = validarRangos(valorIngresado);
  
        // Si alguna validación falla, no continuar con la solicitud
        if (!resultado || !validacion) {
            return;
        }
  
        // Mostrar el overlay de carga
        $('#loadingOverlay').removeClass('d-none');

        // Guardar el tiempo de inicio de la carga
        const startTime = new Date().getTime();

        // Construir la URL de la API
        const url = "https://www.superheroapi.com/api.php/4905856019427443/";
        const apiUrl = url + valorIngresado;
  
        // Realizar la solicitud para obtener los datos del superhéroe
        $.ajax({
            type: "GET",
            url: apiUrl,
            dataType: "json",
            success: function (data) {
                // Actualizar la información del superhéroe en la página
                $('#imagen').attr('src', data.image.url);
                $('#nombre').html(`<h3>Nombre: ${data.name}</h3>`);
                $('#publicado').html(`<p>Publicado: ${data.biography["publisher"]}</p>`);
                $('#conexiones').html(`<p>Conexiones: ${data.connections["group-affiliation"]}</p>`);
                $('#trabajo').html(`<p>Trabajo: ${data.work.occupation}</p>`);
                $('#aparicion').html(`<p>Aparición: ${data.biography["first-appearance"]}</p>`);
                $('#altura').html(`<p>Altura: ${data.appearance.height}</p>`);
                $('#peso').html(`<p>Peso: ${data.appearance.weight}</p>`);
                $('#alianzas').html(`<p>Alianzas: ${data.biography.aliases}</p>`);

                // Crear la gráfica de estadísticas
                var chart = new CanvasJS.Chart("chartContainer", {
                    exportEnabled: true,
                    animationEnabled: true,
                    title: {
                        text: `Estadísticas de Poder para ${data.name}`,
                    },
                    legend: {
                        cursor: "pointer",
                        itemclick: explodePie,
                    },
                    data: [
                        {
                            type: "pie",
                            showInLegend: true,
                            toolTipContent: "{label}: <strong>{y}%</strong>",
                            legendText: "{label}",
                            indexLabel: "{label} {y}",
                            dataPoints: [
                                { y: data.powerstats.intelligence, label: "Intelligence" },
                                { y: data.powerstats.strength, label: "Strength" },
                                { y: data.powerstats.speed, label: "Speed" },
                                { y: data.powerstats.durability, label: "Durability" },
                                { y: data.powerstats.power, label: "Power" },
                                { y: data.powerstats.combat, label: "Combat" },
                            ],
                        },
                    ],
                });
                chart.render();
  
                // Calcular el tiempo total de carga y asegurar que el GIF se muestra al menos 2 segundos
                const endTime = new Date().getTime();
                const elapsedTime = endTime - startTime;
                const minDisplayTime = 2000; 

                // Si el tiempo de carga es menor que 2 segundos, esperar el tiempo restante
                const timeToWait = Math.max(minDisplayTime - elapsedTime, 0);

                setTimeout(function () {
                    $('#loadingOverlay').addClass('d-none');
                    $('#oculto').show();
                }, timeToWait);
            },
            error: function () {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Hubo un problema al obtener los datos del superhéroe.",
                });

                // Asegurar que el GIF se muestra al menos 3 segundos
                const endTime = new Date().getTime();
                const elapsedTime = endTime - startTime;
                const minDisplayTime = 3000; 

                // Si el tiempo de carga es menor que 2 segundos, esperar el tiempo restante
                const timeToWait = Math.max(minDisplayTime - elapsedTime, 0);

                setTimeout(function () {
                    $('#loadingOverlay').addClass('d-none');
                }, timeToWait);
            },
        });
    });
  
    function validar(valorIngresado) {
        let validarNumero = /\d/gim;
        if (validarNumero.test(valorIngresado) == false) {
            Swal.fire({
                icon: "warning",
                title: "Validación",
                text: "Debe ingresar solo números.",
            });
            return false;
        }
        return true;
    }
  
    function validarRangos(valorIngresado) {
        if (valorIngresado <= 0 || valorIngresado >= 732) {
            Swal.fire({
                icon: "warning",
                title: "Validación de Rango",
                text: "Debes ingresar un Número entre 1 y 731.",
            });
            return false;
        }
        return true;
    }
  
    function explodePie(e) {
        if (
            typeof e.dataSeries.dataPoints[e.dataPointIndex].exploded === "undefined" ||
            !e.dataSeries.dataPoints[e.dataPointIndex].exploded
        ) {
            e.dataSeries.dataPoints[e.dataPointIndex].exploded = true;
        } else {
            e.dataSeries.dataPoints[e.dataPointIndex].exploded = false;
        }
        e.chart.render();
    }
});
