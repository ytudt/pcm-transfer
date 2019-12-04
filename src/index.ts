
function arrayToBuffer(array: any, sampleBits: number) {
  const isBuffer = array.byteLength;
  if (isBuffer) return array;
  if (sampleBits === 8) {
    return new Int8Array(array).buffer;
  } if (sampleBits === 16) {
    return new Int16Array(array).buffer;
  }
  return new Int32Array(array).buffer;
}

function floatTo32BitPCM(output: DataView, offset: number, input: any) {
  input = new Int32Array(input);
  for (let i = 0; i < input.length; i += 1, offset += 4) {
    output.setInt32(offset, input[i], true);
  }
  return new Int32Array(output.buffer);
}

function floatTo16BitPCM(output: DataView, offset: number, input: any) {
  input = new Int16Array(input);
  for (let i = 0; i < input.length; i += 1, offset += 2) {
    output.setInt16(offset, input[i], true);
  }
  return new Int16Array(output.buffer);
}

function floatTo8BitPCM(output: DataView, offset: number, input: any) {
  input = new Int8Array(input);
  for (let i = 0; i < input.length; i += 1, offset += 1) {
    output.setInt8(offset, input[i]);
  }
  return new Int8Array(output.buffer);
}

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

function pcmTransfer(samples: any,
  sampleRateTmp: number,
  sampleBits: number,
  channelCount: number) {
  samples = arrayToBuffer(samples, sampleBits);
  const dataLength = samples.byteLength;
  const buffer = new ArrayBuffer(44 + dataLength);
  const view = new DataView(buffer);

  function writeString(dv: DataView, offset: number, string: string) {
    for (let i = 0; i < string.length; i++) {
      dv.setUint8(offset + i, string.charCodeAt(i));
    }
  }
  let offset = 0;
  /* 资源交换文件标识符 */
  writeString(view, offset, 'RIFF'); offset += 4;
  /* 下个地址开始到文件尾总字节数,即文件大小-8 */
  view.setUint32(offset, /* 32 */ 36 + dataLength, true); offset += 4;
  /* WAV文件标志 */
  writeString(view, offset, 'WAVE'); offset += 4;
  /* 波形格式标志 */
  writeString(view, offset, 'fmt '); offset += 4;
  /* 过滤字节,一般为 0x10 = 16 */
  view.setUint32(offset, 16, true); offset += 4;
  /* 格式类别 (PCM形式采样数据) */
  view.setUint16(offset, 1, true); offset += 2;
  /* 通道数 */
  view.setUint16(offset, channelCount, true); offset += 2;
  /* 采样率,每秒样本数,表示每个通道的播放速度 */
  view.setUint32(offset, sampleRateTmp, true); offset += 4;
  /* 波形数据传输率 (每秒平均字节数) 通道数×每秒数据位数×每样本数据位/8 */
  view.setUint32(offset, sampleRateTmp * channelCount * (sampleBits / 8), true); offset += 4;
  /* 快数据调整数 采样一次占用字节数 通道数×每样本的数据位数/8 */
  view.setUint16(offset, channelCount * (sampleBits / 8), true); offset += 2;
  /* 每样本数据位数 */
  view.setUint16(offset, sampleBits, true); offset += 2;
  /* 数据标识符 */
  writeString(view, offset, 'data'); offset += 4;
  /* 采样数据总数,即数据总大小-44 */
  view.setUint32(offset, dataLength, true); offset += 4;
  let waveArray: any = [];
  if (sampleBits === 16) {
    waveArray = floatTo16BitPCM(view, 44, samples);
  } else if (sampleBits === 8) {
    waveArray = floatTo8BitPCM(view, 44, samples);
  } else {
    waveArray = floatTo32BitPCM(view, 44, samples);
  }
  return {
    buffer: view.buffer,
    waveArray: Array.prototype.slice.call(waveArray),
    blobUrl: window.URL.createObjectURL(new Blob([view.buffer], { type: 'audio/wav' })),
  };
}

export default pcmTransfer;
