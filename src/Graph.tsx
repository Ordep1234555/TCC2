import React, { useState } from "react";
import data from './dados_completos.json'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LabelList
} from "recharts";
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';

interface DataItem {
    ano: number;
    grande_area: string;
    conclusoes_mestrado: number;
    conclusoes_doutorado: number;
}

export default function Chart() {
    const [selectedType, setSelectedType] = useState('both');
    const [selectedArea, setSelectedArea] = useState('');
    const isMestrado = ["both", "conclusoes_mestrado"].includes(selectedType)
    const isDoutorado = ["both", "conclusoes_doutorado"].includes(selectedType)
    const [yearRange, setYearRange] = React.useState<number[]>([1946, 2024]);
    const minDistance = 10;
    const [chartType, setChartType] = useState('bar');
    const [showValues, setShowValues] = useState(false);

    const handleChange = (
        _event: Event,
        newYear: number | number[],
        activeThumb: number,
    ) => {
        if (!Array.isArray(newYear)) {
            return;
        }

        if (newYear[1] - newYear[0] < minDistance) {
            if (activeThumb === 0) {
                const clamped = Math.min(newYear[0], 2024 - minDistance);
                setYearRange([clamped, clamped + minDistance]);
            } else {
                const clamped = Math.max(newYear[1], 1946 + minDistance);
                setYearRange([clamped - minDistance, clamped]);
            }
        } else {
            setYearRange(newYear);
        }
    };

    // Ordenar os dados por ano
    data.sort((a, b) => a.ano - b.ano);

    // Aplicar a filtragem
    const filteredData = data.filter(item => {
        const isValidYear = item.ano >= yearRange[0] && item.ano <= yearRange[1];
        let areas: string[] = [];
        if (item.grande_area !== "[]") {
            areas = item.grande_area.replace(/[[\]']+/g, '').split(',').map(area => area.trim()); // Extrair áreas
        }
        const isValidArea = selectedArea === '' ||
            (areas.length === 0 && selectedArea === 'OUTROS') || // Caso especial 'OUTROS'
            areas.some(area => selectedArea.includes(area));
        return isValidYear && isValidArea;
    });

    // Criar um mapa para armazenar as conclusões somadas por ano
    const summedDataMap = new Map<number, DataItem>();

    // Iterar sobre os dados filtrados e somar as conclusões por ano
    filteredData.forEach((item: DataItem) => {
        const existingItem = summedDataMap.get(item.ano);
        if (existingItem) {
            existingItem.conclusoes_mestrado += item.conclusoes_mestrado;
            existingItem.conclusoes_doutorado += item.conclusoes_doutorado;
        } else {
            summedDataMap.set(item.ano, { ...item });
        }
    });

    // Converter o mapa em um array para ser usado no gráfico
    const summedData: DataItem[] = Array.from(summedDataMap.values());



    return (
        <div style={{ width: '95vw', height: '80vh' }} >
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <div style={{ marginRight: '20px' }}>
                    <Typography gutterBottom>Tipo de Gráfico</Typography>
                    <select onChange={(e) => setChartType(e.target.value)}>
                        <option value="bar">Barra</option>
                        <option value="stackedBar">Barra Empilhada</option>
                    </select>
                </div>
                <div style={{ marginRight: '20px' }}>
                    <Typography gutterBottom>Tipo de conclusão</Typography>
                    <select onChange={(e) => setSelectedType(e.target.value)} style={{ width: '150px' }}>
                        <option value="both">Ambos</option>
                        <option value="conclusoes_mestrado">Mestrado</option>
                        <option value="conclusoes_doutorado">Doutorado</option>
                    </select>
                </div>
                <div style={{ marginRight: '20px' }}>
                    <Typography gutterBottom>Grande Área</Typography>
                    <select onChange={(e) => setSelectedArea(e.target.value)}>
                        <option value="">Todas</option>
                        <option value="CIENCIAS_AGRARIAS">Ciências Agrárias</option>
                        <option value="CIENCIAS_BIOLOGICAS">Ciências Biológicas</option>
                        <option value="CIENCIAS_DA_SAUDE">Ciências da Saúde</option>
                        <option value="CIENCIAS_EXATAS_E_DA_TERRA">Ciências Exatas e da Terra</option>
                        <option value="CIENCIAS_HUMANAS">Ciências Humanas</option>
                        <option value="CIENCIAS_SOCIAIS_APLICADAS">Ciências Sociais Aplicadas</option>
                        <option value="ENGENHARIAS">Engenharias</option>
                        <option value="LINGUISTICA_LETRAS_E_ARTES">Linguística, Letras e Artes</option>
                        <option value="OUTROS">Outros</option>
                    </select>
                </div>
                <div style={{ marginLeft: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography gutterBottom>Mostrar Valores</Typography>
                    <input
                        type="checkbox"
                        checked={showValues}
                        onChange={() => setShowValues(!showValues)}
                    />
                </div>
            </div>
            <Box sx={{ Width: 300 }}>
                <Typography gutterBottom>Período</Typography>
                <Slider
                    getAriaLabel={() => 'Minimum distance'}
                    value={yearRange}
                    onChange={handleChange}
                    valueLabelDisplay="auto"
                    disableSwap
                    min={1946}
                    max={2024}
                />
            </Box>
            <ResponsiveContainer
                width='100%'
                height='95%'>
                    <BarChart
                    width={500}
                    height={300}
                        data={summedData}
                        margin={{
                            top: 40,
                            right: 30,
                            left: 20,
                            bottom: 5
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="ano" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        {isMestrado && chartType === 'bar' && <Bar dataKey="conclusoes_mestrado" fill="#8884d8" name="Mestrado">
                            {showValues && <LabelList dataKey="conclusoes_mestrado" position="top" angle={-90} offset={28} content={CostumContent}
                                style={{
                                    fontWeight: 500,
                                    fontSize: '18px',
                                }} />}
                        </Bar>}
                        {isMestrado && chartType === 'stackedBar' && <Bar stackId="a" dataKey="conclusoes_mestrado" fill="#8884d8" name="Mestrado">
                            {showValues && !isDoutorado && <LabelList dataKey="conclusoes_mestrado" position="top" angle={-90} offset={28} content={CostumContent}
                                style={{
                                    fontWeight: 500,
                                    fontSize: '18px',
                                }} />}
                        </Bar>}
                        {isDoutorado && chartType === 'bar' && <Bar dataKey="conclusoes_doutorado" fill="#82ca9d" name="Doutorado">
                            {showValues && <LabelList dataKey="conclusoes_doutorado" position="top" angle={-90} offset={28} content={CostumContent}
                                style={{
                                    fontWeight: 500,
                                    fontSize: '18px',
                                }} />}
                        </Bar>}
                        {isDoutorado && chartType === 'stackedBar' && <Bar stackId="a" dataKey="conclusoes_doutorado" fill="#82ca9d" name="Doutorado">
                            {showValues && <LabelList position="top" angle={-90} offset={28} content={CostumContent}
                                style={{
                                    fontWeight: 500,
                                    fontSize: '18px',
                                }}
                            />}
                        </Bar>}
                    </BarChart>
                </ResponsiveContainer>
        </div>
    );
}

function CostumContent(props) {
    const y = props.y + props.width / 2;
    return <text {...props} y={y} transform={`rotate(-90, ${props.x}, ${props.y - 7})`}
        style={{
            ...props.style,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: props.width,
        }} >
        <tspan>{props.value}</tspan>
    </text>
}