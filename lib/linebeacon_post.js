const _ = require('lodash')

const row2ColSizeSm = (head, data) => ({
    type: 'box',
    layout: 'horizontal',
    contents: [
      {
        color: '#555555',
        flex: 0,
        size: 'sm',
        text: _.padEnd(head, 8, '　'),
        type: 'text',
      },
      {
          "type": "separator"
      },
      {
        align: 'end',
        color: '#111111',
        size: 'sm',
        text: data,
        type: 'text',
        wrap: true,
      }
    ]
  })

module.exports = ({ ctx, event }) => ({
      type: 'flex',
      altText: '上班訊息',
      contents: {
      type: 'bubble',
      body: {
          type: 'box',
          layout: 'vertical',
          spacing: 'md',
          contents: [
          {
              color: '#1DB446',
              size: 'lg',
              text: event.action,
              type: 'text',
              weight: 'bold',
          },
          {
              type: 'separator',
              color: '#cccccc'
          },
          row2ColSizeSm('使用者', _.get(ctx, 'name', '')),
          { "type": "separator" },
          row2ColSizeSm('打卡時間', _.get(ctx, 'txnTime', '')),
          { "type": "separator" },
          row2ColSizeSm('預計下班時間', _.get(ctx, 'exitTime', '')),
          { "type": "separator" },
          row2ColSizeSm('本日上班時數', "8 小時"),
          { "type": "separator" },
          row2ColSizeSm('本日休息時數', "1 小時"),
          { "type": "separator" },
          row2ColSizeSm('打卡地點', _.get(ctx, 'position', '')),
          ]
      }
      }
  })
