import { useEffect, useRef, useState } from 'react';

enum Operator {
    add,
    subtract,
    multiply,
    divide
}

export const useCalculator = () => {

    const [formula, setFormula] = useState('');
    const [number, setNumber] = useState('0');
    const [prevNumber, setPrevNumber] = useState('0');

    const lastOperation = useRef<Operator>();

    useEffect(() => {
        if (lastOperation.current) {
            const firstFormulaPart = formula.split(' ').at(0);
            setFormula(`${firstFormulaPart} ${lastOperation.current} ${number} `);
        } else {
            setFormula(number);
        }
    }, [ number ]);

    useEffect(() => {
        const subResult = calculateSubResult();
        setPrevNumber(`$ {subResult}`);
    }, [formula]);

    const clean = () => {
        setNumber("0");
        setPrevNumber("0");
        lastOperation.current = undefined;
        setFormula("");
    }

    const deleteOperation = () => {

        let currentSign = '';
        let temporalNumber = number;
         
        if (number.includes('-')) {
            currentSign = "-";
            temporalNumber = number.substring(1);
        }

        if (temporalNumber.length > 1) {
            return setNumber(currentSign + temporalNumber.slice(0, -1));
        }
        setNumber('0');
    }

    const toggleSign = () => {
        if (number.includes("-")) {
            return setNumber(number.replace("-", ""));
        }

        setNumber("-" + number);
    }

    const buildNumber = (numberString: string) => {
        
        // Validar para no repetir el mismo simbolo
        if (number.includes('.') && numberString === '.') return;
        
            // Validar para que se repita cero
            if (number.startsWith("0") || number.startsWith("-0")) {
                
                // Punto Decimal
                if (numberString == '.') {
                    return setNumber(number + numberString);
                }
                
                // Evaluar si es otro 0 y no hay punto
                if (numberString === '0' && number.includes(".")) {
                    return setNumber(number + numberString);
                }

                // Evaluar si es diferente de cero, no hay punto y es el primer numero.
                if (numberString !== "0" && !number.includes(".")) {
                    return setNumber(numberString);
                }

                // Evitar que se repitan los 0
                if (numberString == '0' && !number.includes(".")) {
                    return;
                }

                return setNumber(number + numberString);

                }

                setNumber(number + numberString);

    }

    const setLastNumber = () => {
        calculateResult();
        if (number.endsWith(".")) {
            setPrevNumber(number.slice(0, -1));
        } else {
            setPrevNumber(number);
        }
        setNumber('0');
    }

    const divideOperation = () => {
        setLastNumber();
        lastOperation.current = Operator.divide;
    }

    const subtractOperation = () => {
        setLastNumber();
        lastOperation.current = Operator.subtract;
    }

    const addOperation = () => {
        setLastNumber();
        lastOperation.current = Operator.add;
    }

    const multiplyOperation = () => {
        setLastNumber();
        lastOperation.current = Operator.multiply;
    }

    const calculateResult = () => {
        const result = calculateSubResult();
        setFormula(`${result}`);
        lastOperation.current = undefined;
        setPrevNumber('0')
    }

    const calculateSubResult = (): number => {

    const [ firstValue, operation, secondValue ] = formula.split(''); 

    const num1 = Number(firstValue);
    const num2 = Number(secondValue);

    if (isNaN(num2)) return num1;

    switch (lastOperation.current) {
        case Operator.add:
            return num1 + num2;
        case Operator.divide:
            return num1 / num2;
        case Operator.multiply:
            return num1 * num2;
        case Operator.subtract:
            return num1 - num2;
        default:
            throw new Error("Operation no implemented");
        }
    }

  return {
      number,
      buildNumber,
      toggleSign,
      formula,
      clean,
      prevNumber,
      deleteOperation,
      divideOperation,
      subtractOperation,
      addOperation,
      multiplyOperation,
      calculateResult,
    }
}