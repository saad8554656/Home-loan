function calculateLoan() {
    document.querySelector('.table-responsive').style.display = 'block';
    var P = parseFloat(document.getElementById('principal').value); 
    var years = parseInt(document.getElementById('years').value);   
    var roi = parseFloat(document.getElementById('roi').value);   

    // Ensure input values are valid
    if (isNaN(P) || isNaN(years) || isNaN(roi) || P <= 0 || years <= 0 || roi <= 0) {
        alert("Please enter valid positive values for all fields.");
        return;
    }

    var N = years * 12;  
    var R = roi / 12 / 100;  
    var remainingBalance = P;

    var emi = P * R * Math.pow(1 + R, N) / (Math.pow(1 + R, N) - 1);
    emi = Math.round(emi);

    var schedule = '';

    for (let i = 1; i <= years; i++) {
        var openingBalance = remainingBalance;
        var yearlyEMI = emi * 12;
        var interestPaidYearly = 0;
        var principalPaidYearly = 0;

        for (let j = 0; j < 12; j++) {
            var monthlyInterest = remainingBalance * R;
            var monthlyPrincipal = emi - monthlyInterest;

            interestPaidYearly += monthlyInterest;
            principalPaidYearly += monthlyPrincipal;

            remainingBalance -= monthlyPrincipal;

            if (remainingBalance < 0) {
                remainingBalance = 0;
            }
        }

        if (i === years && remainingBalance > 0) {
            principalPaidYearly += remainingBalance;
            remainingBalance = 0; 
        }

        schedule += `
            <tr>
                <td>${i}</td>
                <td>${Math.round(openingBalance)}</td>
                <td>${Math.round(yearlyEMI)}</td>
                <td>${Math.round(interestPaidYearly)}</td>
                <td>${Math.round(principalPaidYearly)}</td>
                <td>${Math.round(remainingBalance)}</td>
            </tr>
        `;
    }

    document.getElementById('loanSchedule').innerHTML = schedule;

    // Chart rendering (ensure the container exists)
    Highcharts.chart('container', {
        chart: {
            type: 'pie'
        },
        title: {
            text: 'Home Loan Calculator'
        },
        series: [{
            name: 'Percentage',
            colorByPoint: true,
            data: [
                { name: 'EMI', y: yearlyEMI },
                { name: 'Interest Paid Yearly', sliced: true, selected: true, y: interestPaidYearly }
            ]
        }]
    });
}
