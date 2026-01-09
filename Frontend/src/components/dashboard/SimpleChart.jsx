import React from 'react'
import Card from '../common/Card'

const SimpleChart = ({ title, type = 'bar', data = [] }) => {
  return (
    <Card className="h-full flex flex-col">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">{title}</h3>
      <div className="flex items-end justify-between flex-1 gap-2 min-h-[200px] pb-6">
        {data.map((item, index) => (
          <div key={index} className="flex flex-col items-center flex-1 group h-full justify-end">
            <div className="relative w-full flex justify-center h-full items-end">
              <div
                className={`w-full max-w-[40px] rounded-t-lg transition-all duration-500 ${type === 'line'
                  ? 'bg-[#1d627d] rounded-full w-2 h-2 absolute bottom-0'
                  : 'bg-[#90e0ef] hover:bg-[#00b4d8] border-t border-white/20'
                  }`}
                style={{
                  height: type === 'line' ? `${item.value}%` : `${item.value}%`,
                  bottom: type === 'line' ? `${item.value}%` : '0'
                }}
              >
                {type === 'line' && (
                  <div className="absolute w-full h-[2px] bg-blue-300 top-1/2 left-1/2 transform -translate-y-1/2 scale-x-150 origin-left" style={{ display: index === data.length - 1 ? 'none' : 'block', width: '200%', transform: `rotate(${data[index + 1] ? Math.atan((data[index + 1].value - item.value) / 20) : 0}rad)` }}></div>
                )}
              </div>
            </div>
            <span className="text-xs text-gray-400 mt-2 font-medium absolute -bottom-6">{item.label}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}

export const SimpleLineChart = ({ title, data }) => {
  return (
    <Card className="h-full flex flex-col">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">{title}</h3>
      <div className="relative border-l border-b border-gray-100 flex-1 min-h-[200px] mb-6">
        <div className="absolute inset-0 flex items-end justify-between px-2">
          {data.map((item, index) => (
            <div key={index} className="flex flex-col items-center justify-end h-full w-full relative">
              <div
                className="w-3 h-3 bg-white border-2 border-[#1d627d] rounded-full z-10 relative hover:scale-125 transition-transform"
                style={{ bottom: `${item.value}%`, position: 'absolute' }}
              ></div>
              <span className="absolute -bottom-6 text-xs text-gray-400">{item.label}</span>
            </div>
          ))}
        </div>
        <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
          <polyline
            fill="none"
            stroke="#1d627d"
            strokeWidth="2"
            points={data.map((d, i) => `${(i * (100 / (data.length - 1)))}%,${100 - d.value}%`).join(' ')}
            transform={`scale(${1 - 1 / data.length}, 1)`}
            style={{ transformOrigin: 'left bottom' }}
          />
        </svg>
      </div>
    </Card>
  )
}

export default SimpleChart
