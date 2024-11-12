import { Transaction } from '../type'

const randomDate = (start: Date, end: Date) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

export const generateSampleData = (): Transaction[] => {
  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  
  const sampleData: Transaction[] = [
    // Tuần này
    {
      id: '1',
      amount: 5000000,
      type: 'income',
      date: new Date(),
      note: 'Lương tháng'
    },
    {
      id: '2',
      amount: 200000,
      type: 'expense',
      date: new Date(now.setDate(now.getDate() - 1)),
      note: 'Ăn trưa',
      category: 'food'
    },
    {
      id: '3',
      amount: 500000,
      type: 'expense',
      date: new Date(now.setDate(now.getDate() - 2)),
      note: 'Đổ xăng',
      category: 'transportation'
    },

    // Tuần trước
    {
      id: '4',
      amount: 1000000,
      type: 'income',
      date: new Date(now.setDate(now.getDate() - 7)),
      note: 'Thưởng dự án'
    },
    {
      id: '5',
      amount: 300000,
      type: 'expense',
      date: new Date(now.setDate(now.getDate() - 8)),
      note: 'Mua sách',
      category: 'education'
    },

    // Tháng này
    {
      id: '6',
      amount: 3000000,
      type: 'income',
      date: new Date(now.setDate(now.getDate() - 15)),
      note: 'Lương part-time'
    },
    {
      id: '7',
      amount: 1500000,
      type: 'expense',
      date: new Date(now.setDate(now.getDate() - 16)),
      note: 'Tiền điện nước',
      category: 'utilities'
    },
    {
      id: '8',
      amount: 2000000,
      type: 'expense',
      date: new Date(now.setDate(now.getDate() - 17)),
      note: 'Tiền nhà',
      category: 'housing'
    },

    // Tháng trước
    {
      id: '9',
      amount: 7000000,
      type: 'income',
      date: new Date(now.setDate(now.getDate() - 35)),
      note: 'Lương tháng trước'
    },
    {
      id: '10',
      amount: 400000,
      type: 'expense',
      date: new Date(now.setDate(now.getDate() - 36)),
      note: 'Mua quần áo',
      category: 'shopping'
    },
    
    // Thêm một số giao dịch chi tiêu khác
    {
      id: '11',
      amount: 300000,
      type: 'expense',
      date: new Date(now.setDate(now.getDate() - 5)),
      note: 'Xem phim',
      category: 'entertainment'
    },
    {
      id: '12',
      amount: 800000,
      type: 'expense',
      date: new Date(now.setDate(now.getDate() - 10)),
      note: 'Khám sức khỏe',
      category: 'health'
    },
    {
      id: '13',
      amount: 500000,
      type: 'expense',
      date: new Date(now.setDate(now.getDate() - 12)),
      note: 'Quà sinh nhật',
      category: 'gifts'
    },
    {
      id: '14',
      amount: 2000000,
      type: 'expense',
      date: new Date(now.setDate(now.getDate() - 20)),
      note: 'Đầu tư cổ phiếu',
      category: 'investment'
    },
    {
      id: '15',
      amount: 150000,
      type: 'expense',
      date: new Date(now.setDate(now.getDate() - 3)),
      note: 'Cắt tóc',
      category: 'personal'
    }
  ]

  return sampleData
}