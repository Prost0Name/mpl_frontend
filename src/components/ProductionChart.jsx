import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import Navigation from './Navigation';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ProductionChart = () => {
  const [productionData, setProductionData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Всего изделий',
        data: [],
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        tension: 0.1,
      },
      {
        label: 'Качественные изделия',
        data: [],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.1,
      },
      {
        label: 'Бракованные изделия',
        data: [],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        tension: 0.1,
      }
    ],
  });

  // Добавляем состояние для статистики
  const [stats, setStats] = useState({
    totalParts: 0,
    qualityParts: 0
  });

  useEffect(() => {
    console.log('Attempting to connect to WebSocket...');
    const ws = new WebSocket('wss://api.vsrs-rs.ru/ws/production');
    
    ws.onopen = () => {
        console.log('WebSocket connection established successfully');
    };

    ws.onmessage = (event) => {
        console.log('Received data:', event.data);
        try {
            const data = JSON.parse(event.data);
            if (!data || !Array.isArray(data) || data.length === 0) {
                console.log('No data received or invalid data format');
                return;
            }

            // Сортируем данные по времени
            const sortedData = [...data].sort((a, b) => 
                new Date(a.interval) - new Date(b.interval)
            );

            const newLabels = sortedData.map(item => {
                const date = new Date(item.interval);
                return date.toLocaleTimeString('ru-RU', {
                    hour: '2-digit',
                    minute: '2-digit'
                });
            });

            const totalCounts = sortedData.map(item => item.total_count);
            const qualityCounts = sortedData.map(item => item.quality_count);
            const defectCounts = sortedData.map(item => item.total_count - item.quality_count);

            // Обновляем общую статистику
            const totalParts = sortedData.reduce((sum, item) => sum + item.total_count, 0);
            const qualityParts = sortedData.reduce((sum, item) => sum + item.quality_count, 0);
            
            setStats({
                totalParts,
                qualityParts
            });

            setProductionData({
                labels: newLabels,
                datasets: [
                    {
                        label: 'Всего изделий',
                        data: totalCounts,
                        borderColor: 'rgb(54, 162, 235)',
                        backgroundColor: 'rgba(54, 162, 235, 0.5)',
                        tension: 0.1,
                    },
                    {
                        label: 'Качественные изделия',
                        data: qualityCounts,
                        borderColor: 'rgb(75, 192, 192)',
                        backgroundColor: 'rgba(75, 192, 192, 0.5)',
                        tension: 0.1,
                    },
                    {
                        label: 'Бракованные изделия',
                        data: defectCounts,
                        borderColor: 'rgb(255, 99, 132)',
                        backgroundColor: 'rgba(255, 99, 132, 0.5)',
                        tension: 0.1,
                    }
                ],
            });
        } catch (error) {
            console.error('Error processing WebSocket data:', error);
        }
    };

    ws.onclose = (event) => {
        console.log('WebSocket connection closed:', event.code, event.reason);
    };

    ws.onerror = (error) => {
        console.error('WebSocket error:', error);
    };

    return () => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.close();
        }
    };
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'График производства изделий',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Количество изделий'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Время'
        }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <Navigation />
      <div style={{ textAlign: 'center', marginTop: '20px', color: '#2C3E50' }}>
        <h1 style={{ color: '#2C3E50' }}>Мониторинг производства</h1>
        
        {/* График */}
        <div style={{ 
          width: '80%', 
          margin: '20px auto',
        }}>
          <Line options={options} data={productionData} />
        </div>
        
        {/* Статистика */}
        <div style={{ 
          width: '80%',
          margin: '20px auto',
          padding: '20px', 
          backgroundColor: '#f5f5f5', 
          borderRadius: '8px',
          display: 'flex',
          justifyContent: 'space-around'
        }}>
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ color: '#2C3E50' }}>Всего изделий изготовлено</h3>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#2196f3' }}>
              {stats.totalParts}
            </p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ color: '#2C3E50' }}>Бракованных изделий</h3>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#f44336' }}>
              {stats.totalParts - stats.qualityParts}
            </p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ color: '#2C3E50' }}>Процент брака</h3>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#ff9800' }}>
              {stats.totalParts > 0 
                ? ((stats.totalParts - stats.qualityParts) / stats.totalParts * 100).toFixed(1)
                : 0}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductionChart;