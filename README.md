# pcm转化工具

## 使用

```
/**
 *
 * @param samples: [Array: ArrayBuffet] pcm数据
 * @param sampleRateTmp [number] 采样率 8000/16000
 * @param sampleBits [number] 位数 8/16/32
 * @param channelCount [Number] 声道,单声道传1,多声道传2
 * return {
 *  buffer, // wave的ArrayBuffer
    waveArray: // wave的普通数组
    blobUrl: // wave的blob url用户音频播放
 * }
 */
 const {blobUrl} = pcmTransfer(samples, sampleRateTmp, sampleBits, channelCount);
```
